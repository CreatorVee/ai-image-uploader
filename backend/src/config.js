import dotenv from "dotenv";
dotenv.config();

export function loadAIConfig() {
  return {
    apiKey: process.env.AI_API_KEY,
    apiUrl: process.env.AI_API_URL,
  };
}

