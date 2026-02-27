import batchService from "../services/batch.service.js";
import catchAsync from "../utils/catchAsync.js";

export const createBatch = catchAsync(async (req, res) => {
  const batch = await batchService.createBatch(
    req.body,
    req.user._id,
    req.user.role
  );

  res.status(201).json({
    success: true,
    data: batch,
  });
});

export const getBatches = catchAsync(async (req, res) => {
  const result = await batchService.getBatches(req.query);

  res.status(200).json({
    success: true,
    ...result,
  });
});

export const getBatchById = catchAsync(async (req, res) => {
  const batch = await batchService.getBatchById(req.params.id);

  res.status(200).json({
    success: true,
    data: batch,
  });
});

export const updateBatch = catchAsync(async (req, res) => {
  const batch = await batchService.updateBatch(
    req.params.id,
    req.body
  );

  res.status(200).json({
    success: true,
    data: batch,
  });
});

export const deleteBatch = catchAsync(async (req, res) => {
  const result = await batchService.deleteBatch(
    req.params.id,
    req.user.role
  );

  res.status(200).json({
    success: true,
    ...result,
  });
});

export const dispatchBatch = catchAsync(async (req, res) => {
  const { quantity } = req.body;

  const result = await batchService.dispatchBatch(
    req.params.id,
    quantity,
    req.user.role
  );

  res.status(200).json({
    success: true,
    ...result,
  });
});