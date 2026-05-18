import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Initialize Gemini
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

app.use(express.json({ limit: '10mb' }));

// API Routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// Gemini Proxy & AI Tools
app.post("/api/ai/:tool", async (req, res) => {
  try {
    const { tool } = req.params;
    const { prompt, model = "gemini-3-flash-preview", systemInstruction, mimeType, data } = req.body;
    
    let aiPrompt = prompt;
    let aiSystemInstruction = systemInstruction;

    // Specialize based on tool
    if (tool === "captions") {
      aiSystemInstruction = "You are a transcription expert. Extract text from the provided audio/video and format as SRT.";
    } else if (tool === "music") {
      aiSystemInstruction = "You are a music production assistant. Describe a musical composition based on the user's prompt in detail, including tempo, key, and instrumentation.";
    } else if (tool === "voiceover") {
      aiSystemInstruction = "You are a professional voice artist. Generate a transcript for a voiceover based on the provided text, including emotional cues and pacing.";
    }

    const response = await ai.models.generateContent({
      model: model,
      contents: data ? [
        { role: 'user', parts: [{ text: aiPrompt || "" }, { inlineData: { mimeType, data } }] }
      ] : aiPrompt,
      config: aiSystemInstruction ? { systemInstruction: aiSystemInstruction } : undefined
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error(`AI Tool (${req.params.tool}) Error:`, error);
    res.status(500).json({ error: error.message });
  }
});

// Vite Middleware for Dev
async function setupVite() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }
}

setupVite().then(() => {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
