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