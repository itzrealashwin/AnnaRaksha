import { SchemaType } from "@google/generative-ai";
import { callGemini } from "../ai/clients/gemini.client.js";
import SensorReading from "../model/sensorReading.model.js";
import Warehouse from "../model/warehouse.model.js";
import AppError from "../utils/AppError.js";
import { getSafeRange } from "../utils/safeRangeEngine.js";

// ─── Response Schema ─────────────────────────────────────────
const riskAnalysisSchema = {
  type: SchemaType.OBJECT,
  properties: {
    riskScore: {
      type: SchemaType.NUMBER,
      description: "A numerical score from 0 to 100 representing the risk of spoilage.",
    },
    riskLevel: {
      type: SchemaType.STRING,
      enum: ["Low", "Medium", "High", "Critical"],
      description: "The severity level of the current storage conditions.",
    },
    reason: {
      type: SchemaType.STRING,
      description: "A concise explanation for the assessed risk score and level.",
    },
    recommendedAction: {
      type: SchemaType.STRING,
      description: "Specific, actionable advice for the warehouse manager to mitigate risk.",
    },
    timeToCriticalHours: {
      type: SchemaType.NUMBER,
      description:
        "Estimated hours until the produce reaches a critical/spoiled state if conditions remain unchanged.",
    },
  },
  required: [
    "riskScore",
    "riskLevel",
    "reason",
    "recommendedAction",
    "timeToCriticalHours",
  ],
};

// ─── System Prompt Builders ───────────────────────────────────
const buildSystemPromptWithRanges = (safeRange) =>
  `You are an expert agricultural storage AI.
You have been provided with the KNOWN safe storage ranges for this produce type.
Safe temperature range: ${safeRange.temp[0]}°C – ${safeRange.temp[1]}°C
Safe humidity range:     ${safeRange.humidity[0]}% – ${safeRange.humidity[1]}%
Use these as the authoritative thresholds when scoring risk.
Evaluate deviation from these ranges, time stored vs shelf life, and output strictly to the requested schema.`;

const buildSystemPromptWithoutRanges = (warehouseType) =>
  `You are an expert agricultural storage AI.
The safe storage ranges for this produce type are NOT predefined in the system.
Based on your agricultural knowledge, determine the appropriate safe temperature and humidity ranges
for this crop in a "${warehouseType}" type warehouse environment.
Then evaluate the provided sensor readings against those inferred ranges, considering time stored vs shelf life.
Output strictly to the requested schema.`;

// ─── Main Export ──────────────────────────────────────────────
export const analyzeRisk = async (batch) => {
  // Fetch sensor and warehouse in parallel
  const [latestSensor, warehouse] = await Promise.all([
    SensorReading.findOne({ warehouseId: batch.warehouseId }).sort({ createdAt: -1 }),
    Warehouse.findById(batch.warehouseId).select("warehouseType"),
  ]);

  if (!latestSensor) {
    throw new AppError(
      `No sensor readings found for warehouse ${batch.warehouseId}`,
      422,
      "NO_SENSOR_DATA"
    );
  }

  if (!warehouse) {
    throw new AppError(
      `Warehouse ${batch.warehouseId} not found`,
      404,
      "WAREHOUSE_NOT_FOUND"
    );
  }

  const warehouseType = warehouse.warehouseType ?? "general";
  const safeRange = getSafeRange(batch.produceType, warehouseType);

  // Choose system prompt based on whether we have predefined ranges
  const systemPrompt = safeRange
    ? buildSystemPromptWithRanges(safeRange)
    : buildSystemPromptWithoutRanges(warehouseType);

  const daysStored = (Date.now() - batch.arrivalDate.getTime()) / (1000 * 60 * 60 * 24);

  const inputData = JSON.stringify({
    produce: batch.produceType,
    warehouseType,
    daysStored: Math.round(daysStored),
    shelfLife: batch.shelfLifeDays,
    temperature: latestSensor.temperature,
    humidity: latestSensor.humidity,
    safeRangeSource: safeRange ? "predefined" : "ai-inferred",
  });

  return await callGemini(systemPrompt, riskAnalysisSchema, inputData);
};


