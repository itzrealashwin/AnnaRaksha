import { callGemini } from "../ai/clients/gemini.client.js";
import SensorReading from "../model/sensorReading.model.js";

export const analyzeRisk = async (batch) => {

  const latestSensor = await SensorReading
    .findOne({ warehouseId: batch.warehouseId })
    .sort({ createdAt: -1 });

  const prompt = `
You are an agricultural storage expert.

Produce: ${batch.produceType}
Days Stored: ${(Date.now() - batch.arrivalDate) / (1000 * 60 * 60 * 24)}
Shelf Life: ${batch.shelfLifeDays}
Temperature: ${latestSensor.temperature}
Humidity: ${latestSensor.humidity}

Respond in JSON:
{
 "riskScore": number,
 "riskLevel": "Low | Medium | High | Critical",
 "reason": "string",
 "recommendedAction": "string",
 "timeToCriticalHours": number
}
`;

  return await callGemini(prompt);
};