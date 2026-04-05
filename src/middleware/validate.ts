// src/middleware/validate.ts
// Zod request validation middleware factory.
// Validates req.body against the given schema and throws 422 on failure.

import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

type ValidationTarget = "body" | "query" | "params";

export function validate(schema: ZodSchema, target: ValidationTarget = "body") {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[target]);
    if (!result.success) {
      return next(result.error);
    }

    // Direct re-assignment of req.query / req.params is forbidden in some Express versions/setups
    // as they are getters. We mutate the original object content instead.
    if (target === "query" || target === "params") {
      const original = (req as any)[target];
      for (const key in original) {
        if (Object.prototype.hasOwnProperty.call(original, key)) {
          delete original[key];
        }
      }
      Object.assign(original, result.data);
    } else {
      (req as any)[target] = result.data;
    }

    next();
  };
}
