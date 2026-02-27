import Batch from "../model/batch.model.js";
import { analyzeRisk } from "../services/riskAnalyzer.service.js";
import { writeRiskToBatch } from "../services/riskWriter.service.js";
import { createAlert } from "../services/alert.service.js";

export const reAnalyzeBatch = async (req, res) => {
  const batch = await Batch.findById(req.params.batchId);
  if (!batch) return res.status(404).json({ message: "Batch not found" });

  const riskData = await analyzeRisk(batch);
  const updatedBatch = await writeRiskToBatch(batch._id, riskData);
  const alert = await createAlert(batch, riskData);

  res.json({ updatedBatch, alert });
};