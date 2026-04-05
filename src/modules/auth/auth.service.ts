// src/modules/auth/auth.service.ts
// Business logic for authentication: registration, login, and token generation.
// The first user to register automatically becomes ADMIN.

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../../config/prisma";
import { env } from "../../config/env";
import { Role } from "../../constants/roles";
import { ApiError } from "../../utils/ApiError";
import type { RegisterInput, LoginInput } from "./auth.schema";

const SALT_ROUNDS = 12;

function generateToken(payload: { id: string; email: string; role: Role }): string {
  return jwt.sign(payload, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  } as jwt.SignOptions);
}

function omitPassword(user: { passwordHash: string; [key: string]: unknown }) {
  const { passwordHash: _pw, ...rest } = user;
  return rest;
}

export async function registerUser(input: RegisterInput) {
  const existing = await prisma.user.findUnique({ where: { email: input.email } });
  if (existing) {
    throw ApiError.conflict("A user with this email already exists.");
  }

  // The very first user in the system becomes ADMIN automatically
  const userCount = await prisma.user.count();
  const role: Role = userCount === 0 ? Role.ADMIN : Role.VIEWER;

  const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);

  const user = await prisma.user.create({
    data: { email: input.email, passwordHash, role },
  });

  const token = generateToken({ id: user.id, email: user.email, role: user.role as Role });

  return { user: omitPassword(user), token };
}

export async function loginUser(input: LoginInput) {
  const user = await prisma.user.findUnique({ where: { email: input.email } });
  if (!user) {
    throw ApiError.unauthorized("Invalid email or password.");
  }

  if (user.status === "INACTIVE") {
    throw ApiError.forbidden("Your account has been deactivated. Contact an administrator.");
  }

  const isPasswordValid = await bcrypt.compare(input.password, user.passwordHash);
  if (!isPasswordValid) {
    throw ApiError.unauthorized("Invalid email or password.");
  }

  const token = generateToken({ id: user.id, email: user.email, role: user.role as Role });

  return { user: omitPassword(user), token };
}
