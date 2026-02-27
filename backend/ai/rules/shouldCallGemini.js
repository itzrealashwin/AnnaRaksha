import { getSafeRange } from "../utils/safeRangeEngine.js";
import { isInCooldown } from "../utils/cooldown.js";

export const shouldCallGemini = (batch, latestSensor) => {
  if (isInCooldown(batch)) return false;

  const range = getSafeRange(batch.produceType);
  if (!range) return false;

  const [minTemp, maxTemp] = range.temp;
  const [minHum, maxHum] = range.humidity;

  const tempOut = latestSensor.temperature < minTemp || latestSensor.temperature > maxTemp;
  const humOut = latestSensor.humidity < minHum || latestSensor.humidity > maxHum;

  return tempOut || humOut;
};