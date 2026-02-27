import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import * as batchController from "../controller/batch.controller.js";

const router = express.Router();

// All batch routes require authentication
router.use(protect);

// POST /api/batches
router.post("/", batchController.createBatch);

router.get("/", batchController.getBatches);

export default router;
