import "dotenv/config";
import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";

import connectDB from "./config/db.js";
import errorHandler from "./middleware/errorHandler.js";
import authRoutes from "./routes/auth.js";
import projectsRoutes from "./routes/projects.js";
import deploymentsRoutes from "./routes/deployments.js";
import incidentsRoutes from "./routes/incidents.js";
import logsRoutes from "./routes/logs.js";
import webhooksRoutes from "./routes/webhooks.js";

const PORT = Number(process.env.PORT) || 5000;
const app = express();
const httpServer = createServer(app);

// Socket.io – attach to same HTTP server. CORS for frontend origin.
const io = new Server(httpServer, {
  cors: { origin: ["http://localhost:8080", "http://localhost:5173", "http://127.0.0.1:8080", "http://127.0.0.1:5173"], credentials: true },
});

io.on("connection", (socket) => {
  console.log("[Socket] Client connected:", socket.id);
  socket.on("disconnect", () => console.log("[Socket] Client disconnected:", socket.id));
});

app.set("io", io);

// CORS – allow frontend
app.use(cors({ origin: true, credentials: true }));

// Body parsing
app.use(express.json({ limit: "1mb" }));

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectsRoutes);
app.use("/api/deployments", deploymentsRoutes);
app.use("/api/incidents", incidentsRoutes);
app.use("/api/logs", logsRoutes);
app.use("/api/webhooks", webhooksRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ success: true, data: { status: "ok" } });
});

// 404 for unmatched routes (API only; frontend is separate)
app.use((req, res) => {
  if (!res.headersSent) res.status(404).json({ success: false, message: "Not found" });
});

// Global error handler – never crash
app.use(errorHandler);

connectDB().then(() => {
  httpServer.listen(PORT, () => {
    console.log(`[Server] Running at http://localhost:${PORT}`);
  });
});
