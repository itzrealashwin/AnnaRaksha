import AppError from "../../utils/AppError.js";
import { isInCooldown } from "../../utils/cooldown.js";
import { getSafeRange } from "../../utils/safeRangeEngine.js";

/**
 * Guard: decide whether Gemini should be invoked for this batch+sensor pair.
 * Throws AppError if arguments are invalid.
 * Returns false if cooldown is active or produce type has no safe-range config.
 */
export const shouldCallGemini = (batch, latestSensor) => {
  if (!batch) throw new AppError("shouldCallGemini: batch is required", 400, "INVALID_ARGUMENT");
  if (!latestSensor) throw new AppError("shouldCallGemini: latestSensor is required", 400, "INVALID_ARGUMENT");

  if (isInCooldown(batch)) return false;

  const range = getSafeRange(batch.produceType);
  if (!range) return false; // unknown produce — skip silently

  const [minTemp, maxTemp] = range.temp;
  const [minHum, maxHum] = range.humidity;

  const tempOut = latestSensor.temperature < minTemp || latestSensor.temperature > maxTemp;
  const humOut = latestSensor.humidity < minHum || latestSensor.humidity > maxHum;

  return tempOut || humOut;
};