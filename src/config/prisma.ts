// src/config/prisma.ts
// Singleton Prisma client to prevent multiple connections in development (hot reload).
// Prisma 7 exports from "@prisma/client/wasm" or the default path depending on setup.

import { PrismaClient } from "../../prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import { env } from "./env";

declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

const pool = new pg.Pool({ connectionString: env.databaseUrl });
const adapter = new PrismaPg(pool);

export const prisma: PrismaClient =
  globalThis.__prisma ??
  new PrismaClient({
    adapter,
    log: env.nodeEnv === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (env.nodeEnv !== "production") {
  globalThis.__prisma = prisma;
}
