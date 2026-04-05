// src/server.ts
// Entry point: starts the HTTP server and handles graceful shutdown.

import "dotenv/config"; // Must be first import to load .env before anything else
import app from "./app";
import { env } from "./config/env";
import { prisma } from "./config/prisma";

const server = app.listen(env.port, () => {
  console.log(`\n🚀  Server running in ${env.nodeEnv} mode`);
  console.log(`📡  Listening on http://localhost:${env.port}`);
  console.log(`✅  Health check at http://localhost:${env.port}/health\n`);
});

// ─── Graceful Shutdown ────────────────────────────────────────────────────────
async function shutdown(signal: string) {
  console.log(`\n[${signal}] Shutting down gracefully...`);
  server.close(async () => {
    await prisma.$disconnect();
    console.log("✅  Database disconnected. Goodbye!\n");
    process.exit(0);
  });
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

// Catch unhandled promise rejections
process.on("unhandledRejection", (reason) => {
  console.error("⚠️  Unhandled Rejection:", reason);
  process.exit(1);
});
