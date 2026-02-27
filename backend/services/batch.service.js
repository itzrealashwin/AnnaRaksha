import Batch from "../model/batch.model.js";
import Warehouse from "../model/warehouse.model.js";
import AppError from "../utils/AppError.js";
import mongoose from "mongoose";

const generateBatchId = async (produceType = "GEN") => {
  const prefix = produceType.slice(0, 3).toUpperCase();
  const unique = Date.now().toString().slice(-6);
  const batchId = `${prefix}-${unique}`;
  
  // Check uniqueness (rare collision possible but safe)
  if (await Batch.findOne({ batchId })) {
    return generateBatchId(produceType); // retry
  }
  return batchId;
};

// Helper: Initial risk score based on arrival time (future mein sensor se update hoga)
const calculateInitialRisk = (batchData) => {
  const now = new Date();
  const arrival = new Date(batchData.arrivalDate);
  const daysStored = Math.floor((now - arrival) / (24 * 60 * 60 * 1000));
  const shelfPercentUsed = daysStored / batchData.shelfLifeDays;

  let score = 0;
  if (shelfPercentUsed > 0.8) score = 40;
  else if (shelfPercentUsed > 0.5) score = 20;

  return Math.min(100, Math.round(score));
};

// export const createBatch = async (data, userId, role) => {
//   const warehouse = await Warehouse.findById(data.warehouseId);

//   if (!warehouse || !warehouse.isActive) {
//     throw new AppError("Warehouse not found or inactive", 404);
//   }

//   // Capacity validation
//   if (warehouse.currentStock + data.quantityInitial > warehouse.capacity) {
//     throw new AppError("Warehouse capacity exceeded", 400);
//   }

//   const batchId = await generateBatchId(data.produceType);

//   const batch = await Batch.create({
//     ...data,
//     batchId,
//     quantityCurrent: data.quantityInitial,
//     createdBy: userId,
//   });

//   // Atomic stock update
//   await Warehouse.findByIdAndUpdate(data.warehouseId, {
//     $inc: { currentStock: data.quantityInitial },
//   });

//   return batch;
// };

export const createBatch = async (data, userId) => {
  const warehouse = await Warehouse.findById(data.warehouseId);
  if (!warehouse || !warehouse.isActive) {
    throw new AppError("Warehouse not found or inactive", 404);
  }

  if (warehouse.currentStock + data.quantityInitial > warehouse.capacity) {
    throw new AppError("Warehouse capacity exceeded", 400);
  }

  const batchId = await generateBatchId(data.produceType);

  const initialRiskScore = calculateInitialRisk(data);

  const batch = await Batch.create({
    ...data,
    batchId,
    quantityCurrent: data.quantityInitial,
    createdBy: userId,
    riskScore: initialRiskScore,
    riskLevel: initialRiskScore >= 85 ? "Critical" :
               initialRiskScore >= 60 ? "High" :
               initialRiskScore >= 30 ? "Medium" : "Low",
    lastRiskUpdatedAt: new Date(),
  });

  // Atomic stock update
  await Warehouse.findByIdAndUpdate(data.warehouseId, {
    $inc: { 
      currentStock: data.quantityInitial,
      currentUtilization: data.quantityInitial  // sync utilization
    },
  });

  return batch;
};

export const getBatches = async (query) => {
  const {
    warehouseId,
    status,
    produceType,
    minRisk,
    page = 1,
    limit = 20,
  } = query;

  const matchStage = { isDeleted: false };

  // Dynamic filters
  if (warehouseId && mongoose.Types.ObjectId.isValid(warehouseId)) {
    matchStage.warehouseId = new mongoose.Types.ObjectId(warehouseId);
  }

  if (status) {
    matchStage.status = status;
  }

  if (produceType) {
    matchStage.produceType = {
      $regex: produceType,
      $options: "i",
    };
  }

  if (minRisk) {
    matchStage.riskScore = { $gte: Number(minRisk) };
  }

  const skip = (Number(page) - 1) * Number(limit);

  const pipeline = [
    { $match: matchStage },

    {
      $lookup: {
        from: "warehouses",
        localField: "warehouseId",
        foreignField: "_id",
        as: "warehouse",
      },
    },
    { $unwind: "$warehouse" },

    { $sort: { createdAt: -1 } },

    {
      $facet: {
        data: [{ $skip: skip }, { $limit: Number(limit) }],
        totalCount: [{ $count: "count" }],
      },
    },
  ];

  const result = await Batch.aggregate(pipeline);

  const batches = result[0].data;
  const total = result[0].totalCount[0]?.count || 0;

  return {
    data: batches,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

export const getBatchById = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError("Invalid batch ID", 400);
  }

  const pipeline = [
    {
      $match: {
        _id: new mongoose.Types.ObjectId(id),
        isDeleted: false,
      },
    },
    {
      $lookup: {
        from: "warehouses",
        localField: "warehouseId",
        foreignField: "_id",
        as: "warehouse",
      },
    },
    { $unwind: "$warehouse" },
    {
      $lookup: {
        from: "sensorreadings",
        let: { warehouseId: "$warehouseId" },
        pipeline: [
          { $match: { $expr: { $eq: ["$warehouseId", "$$warehouseId"] } } },
          { $sort: { recordedAt: -1 } },
          { $limit: 1 }
        ],
        as: "latestSensorReading"
      }
    },
    {
      $addFields: {
        conditions: {
          $arrayElemAt: ["$latestSensorReading", 0]
        }
      }
    },
    {
      $project: {
        latestSensorReading: 0
      }
    }
  ];

  const result = await Batch.aggregate(pipeline);

  if (!result.length) {
    throw new AppError("Batch not found", 404);
  }

  return result[0];
};

export const updateBatch = async (id, data) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError("Invalid batch ID", 400);
  }

  const batch = await Batch.findOne({
    _id: id,
    isDeleted: false,
  });

  if (!batch) {
    throw new AppError("Batch not found", 404);
  }

  if (batch.isLocked) {
    throw new AppError("Batch is locked and cannot be edited", 400);
  }

  // Prevent dangerous updates
  const forbiddenFields = [
    "batchId",
    "quantityCurrent",
    "warehouseId",
    "riskScore",
    "riskLevel",
    "createdBy",
  ];

  forbiddenFields.forEach((field) => {
    if (data[field] !== undefined) {
      delete data[field];
    }
  });

  // Assign safe fields
  Object.assign(batch, data);

  await batch.save(); // triggers pre-save hook for expiryDate

  return batch;
};

export const deleteBatch = async (id, userRole) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError("Invalid batch ID", 400);
  }

  if (userRole !== "admin" && userRole !== "superadmin") {
    throw new AppError("Only Admin or Superadmin can delete batch", 403);
  }

  const batch = await Batch.findOne({
    _id: id,
    isDeleted: false,
  });

  if (!batch) {
    throw new AppError("Batch not found or already deleted", 404);
  }

  // Reduce stock from warehouse
  await Warehouse.findByIdAndUpdate(batch.warehouseId, {
    $inc: { currentStock: -batch.quantityCurrent },
  });

  // Soft delete batch
  batch.isDeleted = true;
  batch.isActive = false;
  batch.deletedAt = new Date();

  await batch.save();

  return { message: "Batch soft-deleted successfully" };
};

// export const dispatchBatch = async (batchId, quantity, userRole) => {
//   if (!mongoose.Types.ObjectId.isValid(batchId)) {
//     throw new AppError("Invalid batch ID", 400);
//   }

//   if (!quantity || quantity <= 0) {
//     throw new AppError("Dispatch quantity must be greater than 0", 400);
//   }

//   const batch = await Batch.findOne({
//     _id: batchId,
//     isDeleted: false,
//     isActive: true,
//   });

//   if (!batch) {
//     throw new AppError("Batch not found", 404);
//   }

//   if (batch.isLocked) {
//     throw new AppError("Batch is locked", 400);
//   }

//   if (batch.quantityCurrent < quantity) {
//     throw new AppError("Insufficient quantity in batch", 400);
//   }

//   // Reduce batch quantity
//   batch.quantityCurrent -= quantity;

//   if (batch.quantityCurrent === 0) {
//     batch.status = "Dispatched";
//   }

//   await batch.save();

//   // Reduce warehouse stock
//   await Warehouse.findByIdAndUpdate(batch.warehouseId, {
//     $inc: { currentStock: -quantity },
//   });

//   return {
//     message: "Batch dispatched successfully",
//     remainingQuantity: batch.quantityCurrent,
//   };
// };

export const dispatchBatch = async (batchId, quantity) => {
  if (!mongoose.Types.ObjectId.isValid(batchId)) {
    throw new AppError("Invalid batch ID", 400);
  }

  if (!quantity || quantity <= 0) {
    throw new AppError("Dispatch quantity must be greater than 0", 400);
  }

  const batch = await Batch.findOne({ _id: batchId, isDeleted: false, isActive: true });
  if (!batch) throw new AppError("Batch not found", 404);

  if (batch.isLocked) throw new AppError("Batch is locked", 400);
  if (batch.quantityCurrent < quantity) throw new AppError("Insufficient quantity", 400);

  const oldQuantity = batch.quantityCurrent;
  batch.quantityCurrent -= quantity;

  if (batch.quantityCurrent === 0) {
    batch.status = "Dispatched";
  }

  await batch.save();

  // Update warehouse – both stock and utilization
  await Warehouse.findByIdAndUpdate(batch.warehouseId, {
    $inc: { 
      currentStock: -quantity,
      currentUtilization: -quantity 
    },
  });

  return {
    message: "Batch dispatched successfully",
    remainingQuantity: batch.quantityCurrent,
    status: batch.status,
  };
};

// New: Recalculate risk for a single batch (call from sensor or cron)
export const recalculateBatchRisk = async (batchId, latestSensor = null) => {
  const batch = await Batch.findById(batchId);
  if (!batch) throw new AppError("Batch not found", 404);

  await batch.recalculateRisk(latestSensor); // model method call

  return batch;
};

export default {
  createBatch,
  getBatches,
  getBatchById,
  updateBatch,
  deleteBatch,
  dispatchBatch,
  recalculateBatchRisk,
};
