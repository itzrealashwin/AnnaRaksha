import Batch from "../model/batch.model.js";
import Warehouse from "../model/warehouse.model.js";
import AppError from "../utils/AppError.js";
import mongoose from "mongoose";

const generateBatchId = async (produceType = "GEN") => {
  const prefix = produceType.slice(0, 3).toUpperCase();
  const unique = Date.now();
  return `${prefix}-${unique}`;
};

export const createBatch = async (data, userId, role) => {
  const warehouse = await Warehouse.findById(data.warehouseId);

  if (!warehouse || !warehouse.isActive) {
    throw new AppError("Warehouse not found or inactive", 404);
  }

  // Capacity validation
  if (warehouse.currentStock + data.quantityInitial > warehouse.capacity) {
    throw new AppError("Warehouse capacity exceeded", 400);
  }

  const batchId = await generateBatchId(data.produceType);

  const batch = await Batch.create({
    ...data,
    batchId,
    quantityCurrent: data.quantityInitial,
    createdBy: userId,
  });

  // Atomic stock update
  await Warehouse.findByIdAndUpdate(data.warehouseId, {
    $inc: { currentStock: data.quantityInitial },
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

export default {
  createBatch,
  getBatches,
};
