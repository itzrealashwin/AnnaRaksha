// src/services/warehouse.service.js

import Warehouse from "../model/warehouse.model.js";
import AppError from "../utils/AppError.js";

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
    // Auto-generate if not provided
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

export const getAllWarehouses = async ({ userId, role, query = {} }) => {
  const filter = { isActive: true };

  // Role-based access filtering
  if (role !== "Admin") {
    filter.$or = [{ createdBy: userId }, { managerId: userId }];
  }

  // Query filters
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

  const warehouses = await Warehouse.find(filter)
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 })
    .populate("managerId", "name email")
    .lean();

  const total = await Warehouse.countDocuments(filter);

  return {
    data: warehouses,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  };
};

export const getWarehouseById = async (id, userId, role) => {
  const warehouse = await Warehouse.findById(id)
    .populate("managerId", "name email")
    .populate("createdBy", "name email")
    .lean();

  if (!warehouse || !warehouse.isActive) {
    throw new AppError("Warehouse not found or inactive", 404);
  }

  // Permission check (non-admin can only see own/assigned)
  if (
    role !== "Admin" &&
    warehouse.createdBy.toString() !== userId &&
    (!warehouse.managerId || warehouse.managerId.toString() !== userId)
  ) {
    throw new AppError(
      "You do not have permission to view this warehouse",
      403,
    );
  }

  return warehouse;
};

export const updateWarehouse = async (id, data, userId, role) => {
  const warehouse = await Warehouse.findById(id);

  if (!warehouse || !warehouse.isActive) {
    throw new AppError("Warehouse not found or inactive", 404);
  }

  if (role !== "Admin" && warehouse.createdBy.toString() !== userId) {
    throw new AppError("Unauthorized to update this warehouse", 403);
  }

  if (data.capacity !== undefined && data.capacity < warehouse.currentStock) {
    throw new AppError("New capacity cannot be less than current stock", 400);
  }

  Object.assign(warehouse, data);
  await warehouse.save();

  return warehouse;
};

export const softDeleteWarehouse = async (id, userId, role) => {
  const warehouse = await Warehouse.findById(id);

  if (!warehouse || !warehouse.isActive) {
    throw new AppError("Warehouse not found or already inactive", 404);
  }

  if (role !== "Admin") {
    throw new AppError("Only Admin can delete warehouses", 403);
  }

  warehouse.isActive = false;
  warehouse.status = "inactive";
  await warehouse.save();

  return { message: "Warehouse soft-deleted successfully" };
};

export default {
  createWarehouse,
  getAllWarehouses,
  getWarehouseById,
  updateWarehouse,
  softDeleteWarehouse,
};
