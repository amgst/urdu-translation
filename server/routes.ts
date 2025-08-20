import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { correctUrduText, isGeminiConfigured } from "./services/gemini";
import { z } from "zod";

const correctTextSchema = z.object({
  text: z.string().min(1, "Text is required"),
});

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Check if Gemini API is configured
  app.get("/api/gemini/status", (req, res) => {
    res.json({ 
      available: isGeminiConfigured() 
    });
  });

  // Correct Urdu text using Gemini AI
  app.post("/api/gemini/correct", async (req, res) => {
    try {
      if (!isGeminiConfigured()) {
        return res.status(400).json({ 
          message: "Gemini API key not configured" 
        });
      }

      const { text } = correctTextSchema.parse(req.body);
      
      const correctedText = await correctUrduText(text);
      
      res.json({ correctedText });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid request data",
          errors: error.errors 
        });
      }
      
      console.error("Error correcting text:", error);
      res.status(500).json({ 
        message: "Failed to correct text" 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
