// src/app.ts
// Express application factory. Separated from server.ts so it can be imported
// in tests without starting an actual HTTP listener.

import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import rateLimit from "express-rate-limit";

import { errorHandler } from "./middleware/errorHandler";
import { env } from "./config/env";

import authRoutes from "./modules/auth/auth.routes";
import userRoutes from "./modules/users/user.routes";
import recordRoutes from "./modules/records/record.routes";
import analyticsRoutes from "./modules/analytics/analytics.routes";

const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
  standardHeaders: true, 
  legacyHeaders: false,
  message: { success: false, message: "Too many requests from this IP, please try again after 15 minutes." },
});

// ─── Security & Utility Middleware ───────────────────────────────────────────
if (env.nodeEnv === "production") {
  app.use("/api", limiter);
}
app.use(helmet()); 

app.use(cors()); // Enable CORS for all origins (configure per environment in prod)
app.use(express.json({ limit: "10kb" })); // Parse JSON bodies, cap size to prevent DoS
app.use(express.urlencoded({ extended: true }));

if (env.nodeEnv !== "test") {
  app.use(morgan(env.nodeEnv === "production" ? "combined" : "dev")); // HTTP request logging
}

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/records", recordRoutes);
app.use("/api/analytics", analyticsRoutes);

// ─── 404 Handler ──────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ success: false, message: "Route not found." });
});

// ─── Global Error Handler (must be last) ──────────────────────────────────────
app.use(errorHandler);

export default app;
