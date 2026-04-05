// src/middleware/errorHandler.ts
// Global error handling middleware. Must be the LAST middleware registered in app.ts.
// Handles: ApiError (known), Zod validation errors, Prisma errors, and unknown errors.

import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { ApiError } from "../utils/ApiError";
import { env } from "../config/env";

// Prisma 7 error codes we care about
const PRISMA_UNIQUE_VIOLATION = "P2002";
const PRISMA_NOT_FOUND = "P2025";

function isPrismaKnownError(err: unknown): err is { code: string; message: string } {
  return (
    typeof err === "object" &&
    err !== null &&
    "code" in err &&
    typeof (err as Record<string, unknown>).code === "string"
  );
}

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  // Known application error
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      ...(err.details !== undefined && { errors: err.details }),
    });
    return;
  }

  // Zod v4 validation error — uses .issues, not .errors
  if (err instanceof ZodError) {
    res.status(422).json({
      success: false,
      message: "Validation failed",
      errors: err.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    });
    return;
  }

  // Prisma known request errors
  if (isPrismaKnownError(err)) {
    if (err.code === PRISMA_UNIQUE_VIOLATION) {
      res.status(409).json({ success: false, message: "A record with this value already exists." });
      return;
    }
    if (err.code === PRISMA_NOT_FOUND) {
      res.status(404).json({ success: false, message: "Record not found." });
      return;
    }
  }

  // Unknown / unexpected error
  const isProduction = env.nodeEnv === "production";
  const message = err instanceof Error ? err.message : "An unexpected error occurred";

  console.error("[ERROR]", err);

  res.status(500).json({
    success: false,
    message: isProduction ? "Internal server error" : message,
    ...(isProduction
      ? {}
      : { stack: err instanceof Error ? err.stack : undefined }),
  });
}
