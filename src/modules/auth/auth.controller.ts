// src/modules/auth/auth.controller.ts
// Thin controller layer: retrieves validated body, delegates to service, sends response.

import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { sendCreated, sendSuccess } from "../../utils/response";
import { registerUser, loginUser } from "./auth.service";
import type { RegisterInput, LoginInput } from "./auth.schema";

export const register = asyncHandler(async (req: Request, res: Response) => {
  const result = await registerUser(req.body as RegisterInput);
  sendCreated(res, result, "Registration successful");
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const result = await loginUser(req.body as LoginInput);
  sendSuccess(res, result, "Login successful");
});
