import mongoose from "mongoose";
import SensorReading from "../model/sensorReading.model.js";
import Warehouse from "../model/warehouse.model.js";

export const getTodaySensorDataByWarehouse = async (
  warehouseId,
  userId,
  role,
) => {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const warehouse = await Warehouse.findOne({
    _id: warehouseId,
    isActive: true,
  });

  if (!warehouse) {
    throw new Error("Warehouse not found");
  }

  const sensorData = await SensorReading.find({
    warehouseId,
    recordedAt: { $gte: startOfDay },
  })
    .sort({ recordedAt: 1 })
    .select("temperature humidity recordedAt -_id");

  return {
    warehouseId: warehouse._id,
    name: warehouse.name,
    code: warehouse.code,
    sensorData,
  };
};
