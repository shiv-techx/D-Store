import express from "express";
import { createServer as createViteServer, loadEnv } from "vite";
import path from "path";
import { createProxyMiddleware } from "http-proxy-middleware";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Load env vars using Vite's loadEnv
  const env = loadEnv(process.env.NODE_ENV || 'development', process.cwd(), '');

  // Proxy Sanity API requests to bypass CORS
  app.use(
    "/api/sanity",
    createProxyMiddleware({
      target: `https://${env.VITE_SANITY_PROJECT_ID || 'el3r3rtq'}.api.sanity.io`,
      changeOrigin: true,
      pathRewrite: {
        "^/api/sanity": "",
      },
      router: (req) => {
        // Route GET requests to the CDN for better performance
        if (req.method === 'GET') {
          return `https://${env.VITE_SANITY_PROJECT_ID || 'el3r3rtq'}.apicdn.sanity.io`;
        }
        // Route mutations (POST, etc.) to the uncached API
        return `https://${env.VITE_SANITY_PROJECT_ID || 'el3r3rtq'}.api.sanity.io`;
      }
    })
  );

  // API routes FIRST
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
