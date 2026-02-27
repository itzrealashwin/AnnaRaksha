import AppError from "../../utils/AppError.js";
import { isInCooldown } from "../../utils/cooldown.js";
import { getSafeRange } from "../../utils/safeRangeEngine.js";

/**
 * Guard: decide whether Gemini should be invoked for this batch+sensor pair.
 *
 * @param {object} batch         - Batch document
 * @param {object} latestSensor  - Most recent SensorReading document
 * @param {string} warehouseType - Warehouse type (cold/dry/general/open-air)
 *
 * Throws AppError if required arguments are missing.
 * Returns true  → conditions exceed safe range thresholds (call Gemini).
 * Returns false → cooldown active, or no predefined range exists AND
 *                 conditions appear nominal (let AI scheduler decide on next cycle).
 */
export const shouldCallGemini = (batch, latestSensor, warehouseType = "general") => {
  if (!batch) throw new AppError("shouldCallGemini: batch is required", 400, "INVALID_ARGUMENT");
  if (!latestSensor) throw new AppError("shouldCallGemini: latestSensor is required", 400, "INVALID_ARGUMENT");

  if (isInCooldown(batch)) return false;

  const range = getSafeRange(batch.produceType, warehouseType);

  // If no predefined range exists, always allow Gemini to make the call
  // (it will infer appropriate ranges for the crop + warehouse type).
  if (!range) return true;

  const [minTemp, maxTemp] = range.temp;
  const [minHum, maxHum] = range.humidity;

  const tempOut = latestSensor.temperature < minTemp || latestSensor.temperature > maxTemp;
  const humOut = latestSensor.humidity < minHum || latestSensor.humidity > maxHum;

  return tempOut || humOut;
};