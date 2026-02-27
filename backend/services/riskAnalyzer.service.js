import { SchemaType } from "@google/generative-ai";
import { callGemini } from "../ai/clients/gemini.client.js";
import SensorReading from "../model/sensorReading.model.js";
import AppError from "../utils/AppError.js";
// 1. Define the strict response schema
const riskAnalysisSchema = {
  type: SchemaType.OBJECT,
  properties: {
    riskScore: {
      type: SchemaType.NUMBER,
      description: "A numerical score from 0 to 100 representing the risk of spoilage."
    },
    riskLevel: {
      type: SchemaType.STRING,
      enum: ["Low", "Medium", "High", "Critical"],
      description: "The severity level of the current storage conditions."
    },
    reason: {
      type: SchemaType.STRING,
      description: "A concise explanation for the assessed risk score and level."
    },
    recommendedAction: {
      type: SchemaType.STRING,
      description: "Specific, actionable advice for the warehouse manager to mitigate risk."
    },
    timeToCriticalHours: {
      type: SchemaType.NUMBER,
      description: "Estimated hours until the produce reaches a critical/spoiled state if conditions remain unchanged."
    }
  },
  required: ["riskScore", "riskLevel", "reason", "recommendedAction", "timeToCriticalHours"]
};
// 2. The static system instruction
const systemPrompt = `You are an expert agricultural storage AI. Analyze the provided batch and sensor data. Evaluate the risk of spoilage based on crop type, time stored, temperature, and humidity. Output strictly to the requested schema.`;
export const analyzeRisk = async (batch) => {
  const latestSensor = await SensorReading
    .findOne({ warehouseId: batch.warehouseId })
    .sort({ createdAt: -1 });
  if (!latestSensor) {
    throw new AppError(
      `No sensor readings found for warehouse ${batch.warehouseId}`,
      422,
      "NO_SENSOR_DATA"
    );
  }
  const daysStored = (Date.now() - batch.arrivalDate.getTime()) / (1000 * 60 * 60 * 24);
  // 3. The dynamic payload
  const inputData = JSON.stringify({
    produce: batch.produceType,
    daysStored: Math.round(daysStored),
    shelfLife: batch.shelfLifeDays,
    temperature: latestSensor.temperature,
    humidity: latestSensor.humidity
  });
  // 4. Execute the call using the pipeline
  return await callGemini(systemPrompt, riskAnalysisSchema, inputData);
}; 


