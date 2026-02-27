import { GoogleGenerativeAI } from "@google/generative-ai";
import { AI_CONFIG } from "../config/ai.config.js";
import AppError from "../../utils/AppError.js";

const genAI = new GoogleGenerativeAI(AI_CONFIG.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: AI_CONFIG.MODEL
});

/**
 * Calls the Gemini API strictly as a processing engine (no chat history).
 * @param {string} systemPrompt - The strict instructions for the AI to follow.
 * @param {object} [responseSchema=null] - Optional Gemini Schema object to enforce JSON structure.
 * @param {string} [inputData="Execute instructions."] - Optional raw data to process.
 */
export const callGemini = async (systemPrompt, responseSchema = null, inputData = "Execute instructions.") => {
  let attempt = 0;

  const generationConfig = {};
  
  if (responseSchema) {
    generationConfig.responseMimeType = "application/json";
    generationConfig.responseSchema = responseSchema;
  }

  while (attempt <= AI_CONFIG.MAX_RETRIES) {
    try {
      const result = await model.generateContent({
        // 1. systemInstruction dictates exactly HOW the AI should behave
        systemInstruction: systemPrompt, 
        // 2. contents contains the actual trigger or payload data
        contents: [{ role: "user", parts: [{ text: inputData }] }],
        generationConfig
      });
      
      const text = result.response.text();
        
      if (responseSchema) {
        return JSON.parse(text);
      }
      
      return text;

    } catch (error) {
      attempt++;
      console.warn(`[Gemini] Attempt ${attempt} failed:`, error.message);
      
      if (attempt > AI_CONFIG.MAX_RETRIES) {
        throw new AppError(
          `Gemini unavailable after ${AI_CONFIG.MAX_RETRIES} retries: ${error.message}`,
          503,
          "GEMINI_UNAVAILABLE"
        );
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
    }
  }
};