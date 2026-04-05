// src/utils/asyncHandler.ts
// A wrapper that catches errors in async route handlers and forwards them
// to Express's next() error handler, eliminating try/catch boilerplate.

import { Request, Response, NextFunction } from "express";

type AsyncHandler = (req: Request, res: Response, next: NextFunction) => Promise<void>;

export const asyncHandler =
  (fn: AsyncHandler) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
