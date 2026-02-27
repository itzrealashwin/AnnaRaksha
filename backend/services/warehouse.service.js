// src/services/warehouse.service.js

import Warehouse from "../model/warehouse.model.js";
import AppError from "../utils/AppError.js";
import mongoose from "mongoose";
import Batch from "../model/batch.model.js";
// Helper: Generate unique code like PUNE-001, MUM-002 etc.
const generateUniqueCode = async (namePrefix = "WH") => {
  const prefix = namePrefix.slice(0, 4).toUpperCase();
  let counter = 1;
  let code;

  do {
    code = `${prefix}-${String(counter).padStart(3, "0")}`;
    counter++;
  } while (await Warehouse.findOne({ code }));

  return code;
};

export const createWarehouse = async (data, userId) => {
  let code = data.code;

  if (!code) {
    code = await generateUniqueCode(data.name || "WH");
  }

  const warehouse = new Warehouse({
    ...data,
    code,
    createdBy: userId,
    currentUtilization: 0,
    currentStock: 0,
  });

  await warehouse.save();
  return warehouse;
};

// export const getAllWarehouses = async ({ userId, role, query = {} }) => {
//   const filter = { isActive: true };

//   if (role !== "admin" && role !== "superadmin") {
//     filter.$or = [{ createdBy: new mongoose.Types.ObjectId(userId) }, { managerId: new mongoose.Types.ObjectId(userId) }];
//   }

//   if (query.status) filter.status = query.status;
//   if (query.search) {
//     filter.$or = [
//       { name: { $regex: query.search, $options: "i" } },
//       { code: { $regex: query.search, $options: "i" } },
//     ];
//   }

//   const page = parseInt(query.page) || 1;
//   const limit = parseInt(query.limit) || 20;
//   const skip = (page - 1) * limit;

//   const [result] = await Warehouse.aggregate([
//     { $match: filter },
//     { $sort: { createdAt: -1 } },
//     {
//       $lookup: {
//         from: "users",
//         localField: "managerId",
//         foreignField: "_id",
//         pipeline: [{ $project: { name: 1, email: 1 } }],
//         as: "managerId",
//       },
//     },
//     {
//       $unwind: {
//         path: "$managerId",
//         preserveNullAndEmptyArrays: true,
//       },
//     },
//     {
//       $facet: {
//         data: [{ $skip: skip }, { $limit: limit }],
//         total: [{ $count: "count" }],
//       },
//     },
//   ]);

//   const total = result?.total[0]?.count || 0;

//   return {
//     data: result?.data || [],
//     pagination: { page, limit, total, pages: Math.ceil(total / limit) },
//   };
// };

// export const getWarehouseById = async (id, userId, role) => {
//   const [warehouse] = await Warehouse.aggregate([
//     { $match: { _id: new mongoose.Types.ObjectId(id), isActive: true } },
//     {
//       $lookup: {
//         from: "users",
//         localField: "managerId",
//         foreignField: "_id",
//         pipeline: [{ $project: { name: 1, email: 1 } }],
//         as: "managerId",
//       },
//     },
//     {
//       $unwind: {
//         path: "$managerId",
//         preserveNullAndEmptyArrays: true,
//       },
//     },
//     {
//       $lookup: {
//         from: "users",
//         localField: "createdBy",
//         foreignField: "_id",
//         pipeline: [{ $project: { name: 1, email: 1 } }],
//         as: "createdBy",
//       },
//     },
//     {
//       $unwind: {
//         path: "$createdBy",
//         preserveNullAndEmptyArrays: true,
//       },
//     },
//   ]);

//   if (!warehouse) {
//     throw new AppError("Warehouse not found or inactive", 404);
//   }

//   if (
//     role !== "admin" &&
//     role !== "superadmin" &&
//     warehouse.createdBy._id.toString() !== userId &&
//     (!warehouse.managerId || warehouse.managerId._id.toString() !== userId)
//   ) {
//     throw new AppError("You do not have permission to view this warehouse", 403);
//   }

//   return warehouse;
// };

export const getAllWarehouses = async ({ userId, role, query = {} }) => {
  const filter = { isActive: true };

  // Consistent role check (tumhare code ke hisaab se admin/superadmin)
  const isAdmin = role === "admin" || role === "superadmin";
  if (!isAdmin) {
    filter.$or = [
      { createdBy: new mongoose.Types.ObjectId(userId) },
      { managerId: new mongoose.Types.ObjectId(userId) },
    ];
  }

  if (query.status) filter.status = query.status;
  if (query.search) {
    filter.$or = [
      { name: { $regex: query.search, $options: "i" } },
      { code: { $regex: query.search, $options: "i" } },
    ];
  }

  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 20;
  const skip = (page - 1) * limit;

  const [result] = await Warehouse.aggregate([
    { $match: filter },
    { $sort: { createdAt: -1 } },
    {
      $lookup: {
        from: "users",
        localField: "managerId",
        foreignField: "_id",
        pipeline: [{ $project: { name: 1, email: 1 } }],
        as: "manager",
      },
    },
    {
      $unwind: { path: "$manager", preserveNullAndEmptyArrays: true },
    },
    {
      $project: {
        name: 1,
        code: 1,
        warehouseType: 1,
        capacity: 1,
        currentStock: 1,
        currentUtilization: 1,
        utilizationPercent: 1, // virtual
        status: 1,
        location: 1,
        manager: 1,
        createdBy: 1, // optional – agar chahiye to
        createdAt: 1,
        updatedAt: 1,
      },
    },
    {
      $facet: {
        data: [{ $skip: skip }, { $limit: limit }],
        total: [{ $count: "count" }],
      },
    },
  ]);

  const total = result?.total[0]?.count || 0;

  return {
    data: result?.data || [],
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  };
};
export const getWarehouseById = async (id, userId, role) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError("Invalid warehouse ID", 400);
  }

  const [warehouse] = await Warehouse.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(id), isActive: true } },
    {
      $lookup: {
        from: "users",
        localField: "managerId",
        foreignField: "_id",
        pipeline: [{ $project: { name: 1, email: 1 } }],
        as: "manager",
      },
    },
    { $unwind: { path: "$manager", preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: "users",
        localField: "createdBy",
        foreignField: "_id",
        pipeline: [{ $project: { name: 1, email: 1 } }],
        as: "createdBy",
      },
    },
    { $unwind: { path: "$createdBy", preserveNullAndEmptyArrays: true } },
    {
      $project: {
        name: 1,
        code: 1,
        warehouseType: 1,
        capacity: 1,
        currentStock: 1,
        currentUtilization: 1,
        utilizationPercent: 1,
        status: 1,
        location: 1,
        manager: 1,
        createdBy: 1,
        createdAt: 1,
        updatedAt: 1,
      },
    },
  ]);

  if (!warehouse) {
    throw new AppError("Warehouse not found or inactive", 404);
  }

  const isAdmin = role === "admin" || role === "superadmin";
  if (
    !isAdmin &&
    warehouse.createdBy?._id?.toString() !== userId &&
    (!warehouse.manager?._id || warehouse.manager._id.toString() !== userId)
  ) {
    throw new AppError("You do not have permission to view this warehouse", 403);
  }

  return warehouse;
};
export const updateWarehouse = async (id, data, userId, role) => {
  const warehouse = await Warehouse.findById(id);

  if (!warehouse || !warehouse.isActive) {
    throw new AppError("Warehouse not found or inactive", 404);
  }

  if (role !== "admin" && role !== "superadmin" && warehouse.createdBy.toString() !== userId) {
    throw new AppError("Unauthorized to update this warehouse", 403);
  }

  if (data.capacity !== undefined && data.capacity < warehouse.currentStock) {
    throw new AppError("New capacity cannot be less than current stock", 400);
  }

  Object.assign(warehouse, data);
  await warehouse.save();

  return warehouse;
};

// export const softDeleteWarehouse = async (id, userId, role) => {
//   const warehouse = await Warehouse.findById(id);

//   if (!warehouse || !warehouse.isActive) {
//     throw new AppError("Warehouse not found or already inactive", 404);
//   }

//   if (role !== "admin" && role !== "superadmin") {
//     throw new AppError("Only Admin or Superadmin can delete warehouses", 403);
//   }

//   warehouse.isActive = false;
//   warehouse.status = "inactive";
//   await warehouse.save();

//   return { message: "Warehouse soft-deleted successfully" };
// };


export const softDeleteWarehouse = async (id, userId, role) => {
  // 1. FAIL FAST: Check authorization before making ANY database calls
  if (role !== "admin" && role !== "superadmin") {
    throw new AppError("Only Admin or Superadmin can delete warehouses", 403);
  }

  // 2. PARALLELIZE & OPTIMIZE QUERIES
  // Run both queries simultaneously. 
  // Use .select() to only fetch required fields.
  // Use .exists() instead of .countDocuments() for a massive speed boost.
  const [warehouse, hasActiveBatches] = await Promise.all([
    Warehouse.findById(id).select("isActive").lean(),
    Batch.exists({
      warehouseId: id, // Mongoose handles string -> ObjectId conversion automatically here
      isActive: true,
      isDeleted: false,
      status: { $nin: ["Dispatched", "Disposed"] },
    })
  ]);

  if (!warehouse || !warehouse.isActive) {
    throw new AppError("Warehouse not found or already inactive", 404);
  }

  if (hasActiveBatches) {
    // Note: We don't provide the exact count anymore, as calculating the exact count is slower.
    throw new AppError("Cannot delete warehouse containing active batches", 400);
  }

  // 3. DIRECT UPDATE: Bypasses Mongoose document hydration and save hooks for speed
  await Warehouse.updateOne(
    { _id: id },
    { $set: { isActive: false, status: "inactive" } }
  );

  return { message: "Warehouse soft-deleted successfully" };
};
export default {
  createWarehouse,
  getAllWarehouses,
  getWarehouseById,
  updateWarehouse,
  softDeleteWarehouse,
};
