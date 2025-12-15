import axios from "axios";
import { loadAIConfig } from "./config.js";

export async function callAIService(imagePath) {
  const { apiKey, apiUrl } = loadAIConfig();

  // Fake return for now
  return "https://fake-image-url.com/result.png";
}

