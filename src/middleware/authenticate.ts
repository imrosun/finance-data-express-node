// src/middleware/authenticate.ts
// Verifies the JWT in the Authorization header and attaches the decoded user
// payload to req.user. Throws 401 if the token is missing or invalid.

import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { ApiError } from "../utils/ApiError";
import { Role } from "../constants/roles";

interface JwtPayload {
  id: string;
  email: string;
  role: Role;
}

export function authenticate(req: Request, _res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(ApiError.unauthorized("No token provided. Please include a Bearer token."));
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, env.jwtSecret) as JwtPayload;
    req.user = { id: decoded.id, email: decoded.email, role: decoded.role };
    next();
  } catch {
    next(ApiError.unauthorized("Invalid or expired token."));
  }
}
