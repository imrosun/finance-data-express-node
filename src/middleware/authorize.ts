// src/middleware/authorize.ts
// Role-based access control (RBAC) middleware factory.
// Usage: router.get('/admin-only', authenticate, authorize(Role.ADMIN), handler)
//        router.get('/analysts-up', authenticate, authorize(Role.ANALYST, Role.ADMIN), handler)

import { Request, Response, NextFunction } from "express";
import { Role } from "../constants/roles";
import { ApiError } from "../utils/ApiError";

export function authorize(...allowedRoles: Role[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(ApiError.unauthorized());
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        ApiError.forbidden(
          `Access denied. Required roles: ${allowedRoles.join(", ")}. Your role: ${req.user.role}`
        )
      );
    }

    next();
  };
}
