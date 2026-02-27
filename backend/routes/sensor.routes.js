import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import * as sensorController from "../controller/sensor.controller.js";

const router = express.Router();

// All sensor routes require authentication
router.use(protect);

// GET: Today's sensor data (all warehouses user has access to)
router.get(
  "/:warehouseId/today",
  sensorController.getTodaySensorDataByWarehouse,
);

export default router;
