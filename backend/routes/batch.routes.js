import express from "express";
import { authorizeRoles, protect } from "../middlewares/auth.middleware.js";
import * as batchController from "../controller/batch.controller.js";

const router = express.Router();

// All batch routes require authentication
router.use(protect);

// POST /api/batches
router.post("/", batchController.createBatch);

router.get("/", batchController.getBatches);

router.get("/:id", batchController.getBatchById);

router.post("/:id", batchController.updateBatch);

router.delete(
  "/:id",
  authorizeRoles("admin", "superadmin"),
  batchController.deleteBatch,
);

router.post("/:id/dispatch", batchController.dispatchBatch);

export default router;
