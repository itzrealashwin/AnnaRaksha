import { AI_CONFIG } from "../ai/config/ai.config.js";

export const isInCooldown = (batch) => {
  if (!batch.aiCooldownUntil) return false;
  return new Date() < batch.aiCooldownUntil;
};

export const getNextCooldownTime = () => {
  const now = new Date();
  now.setMinutes(now.getMinutes() + AI_CONFIG.COOLDOWN_MINUTES);
  return now;
};