// src/routes/warehouse.routes.js
import express from "express";
import * as warehouseController from "../controller/warehouse.controller.js";
import { protect, authorizeRoles } from "../middlewares/auth.middleware.js";

const router = express.Router();

// All warehouse routes require a valid access token
router.use(protect);

router
  .route("/")
  .post(warehouseController.createWarehouse)   // any authenticated user
  .get(warehouseController.getAllWarehouses);   // any authenticated user

router
  .route("/:id")
  .get(warehouseController.getWarehouse)        // any authenticated user
  .patch(warehouseController.updateWarehouse)   // owner or admin (checked in service)
  .delete(authorizeRoles("admin", "superadmin"), warehouseController.deleteWarehouse);

export default router;
