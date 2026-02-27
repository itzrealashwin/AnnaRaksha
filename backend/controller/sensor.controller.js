import catchAsync from "../utils/catchAsync.js";
import * as sensorService from "../services/sensor.service.js";

export const getTodaySensorDataByWarehouse = catchAsync(async (req, res) => {
  const { warehouseId } = req.params;

  const data = await sensorService.getTodaySensorDataByWarehouse(
    warehouseId,
    req.user._id,
    req.user.role,
  );

  res.status(200).json({
    success: true,
    data,
  });
});
