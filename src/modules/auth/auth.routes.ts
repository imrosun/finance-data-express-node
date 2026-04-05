// src/modules/auth/auth.routes.ts

import { Router } from "express";
import { validate } from "../../middleware/validate";
import { registerSchema, loginSchema } from "./auth.schema";
import { register, login } from "./auth.controller";

const router = Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user (first user is auto-promoted to ADMIN)
 * @access  Public
 */
router.post("/register", validate(registerSchema), register);

/**
 * @route   POST /api/auth/login
 * @desc    Log in and receive a JWT
 * @access  Public
 */
router.post("/login", validate(loginSchema), login);

export default router;
