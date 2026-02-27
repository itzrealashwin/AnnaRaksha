// src/routes/warehouse.routes.js
import express from "express";
import * as warehouseController from "../controller/warehouse.controller.js";

import { protect } from "../middlewares/auth.middleware.js";
import { restrictTo } from "../middlewares/role.middleware.js";

const router = express.Router();

router.use(protect);

router
  .route("/")
  .post(warehouseController.createWarehouse)
  .get(warehouseController.getAllWarehouses);

router
  .route("/:id")
  .get(warehouseController.getWarehouse)
  .patch(warehouseController.updateWarehouse)
  .delete(warehouseController.deleteWarehouse);

export default router;
