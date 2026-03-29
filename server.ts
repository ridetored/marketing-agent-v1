import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import "dotenv/config";
import { fetchGoogleAdsData, fetchMetaAdsData } from "./src/services/adsService.js";
import { getAIStrategy } from "./src/services/aiService.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function startServer() {
  const app = express();
  const PORT = 3000;
  app.use(express.json());

  console.log("GEMINI_API_KEY is set:", !!process.env.GEMINI_API_KEY);

  // API routes
  app.get("/api/ads-data", async (req, res) => {
    const googleAdsKey = req.headers['x-google-ads-api-key'] as string;
    const metaKey = req.headers['x-meta-api-key'] as string;
    const googleData = await fetchGoogleAdsData(googleAdsKey);
    const metaData = await fetchMetaAdsData(metaKey);
    res.json([...googleData, ...metaData]);
  });

  app.post("/api/ai-strategy", async (req, res) => {
    const { data } = req.body;
    const geminiKey = req.headers['x-gemini-api-key'] as string;
    const strategy = await getAIStrategy(JSON.stringify(data), geminiKey);
    res.json({ strategy });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
