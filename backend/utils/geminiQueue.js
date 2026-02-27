import PQueue from "p-queue";

// Gemini free tier: 5 requests per minute = 1 request every 12 seconds
// We use concurrency: 1 + interval to enforce this globally
const geminiQueue = new PQueue({
  concurrency: 1,         // Only 1 request at a time
  interval: 12000,        // Per 12 seconds
  intervalCap: 1,         // Max 1 request per interval
});

geminiQueue.on("active", () => {
  console.log(`[Gemini Queue] Processing task. Queue size: ${geminiQueue.size} | Pending: ${geminiQueue.pending}`);
});

geminiQueue.on("idle", () => {
  console.log("[Gemini Queue] All tasks completed. Queue is idle.");
});

export default geminiQueue;