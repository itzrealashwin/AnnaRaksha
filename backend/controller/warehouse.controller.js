// src/controllers/warehouse.controller.js
import warehouseService from "../services/warehouse.service.js";
import catchAsync from "../utils/catchAsync.js"; // wrapper for async error handling

 
export const createWarehouse = catchAsync(async (req, res) => {
  const warehouse = await warehouseService.createWarehouse(
    req.body,
    req.user._id,
  );
  res.status(201).json({
    success: true,
    data: warehouse,
  });
});

export const getAllWarehouses = catchAsync(async (req, res) => {
  const result = await warehouseService.getAllWarehouses({
    userId: req.user._id,
    role: req.user.role,
    query: req.query,
  });

  res.status(200).json({
    success: true,
    ...result,
  });
});

export const getWarehouse = catchAsync(async (req, res) => {
  const warehouse = await warehouseService.getWarehouseById(
    req.params.id,
    req.user._id,
    req.user.role,
  );

  res.status(200).json({
    success: true,
    data: warehouse,
  });
});

export const updateWarehouse = catchAsync(async (req, res) => {
  const warehouse = await warehouseService.updateWarehouse(
    req.params.id,
    req.body,
    req.user._id,
    req.user.role,
  );

  res.status(200).json({
    success: true,
    data: warehouse,
  });
});

export const deleteWarehouse = catchAsync(async (req, res) => {
  const result = await warehouseService.softDeleteWarehouse(
    req.params.id,
    req.user._id,
    req.user.role,
  );

  res.status(200).json({
    success: true,
    ...result,
  });
});
