// src/modules/users/user.schema.ts
// Zod v4 compatible schemas for user management operations.

import { z } from "zod";
import { Role, UserStatus } from "../../constants/roles";

// Zod v4: z.enum() takes a tuple, not an array, for custom error messages use .message not errorMap
export const updateRoleSchema = z.object({
  role: z.enum([Role.VIEWER, Role.ANALYST, Role.ADMIN] as const, {
    message: `Role must be one of: ${Object.values(Role).join(", ")}`,
  }),
});

export const updateStatusSchema = z.object({
  status: z.enum([UserStatus.ACTIVE, UserStatus.INACTIVE] as const, {
    message: `Status must be one of: ACTIVE, INACTIVE`,
  }),
});

export const listUsersQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  role: z.enum([Role.VIEWER, Role.ANALYST, Role.ADMIN] as const).optional(),
  status: z.enum([UserStatus.ACTIVE, UserStatus.INACTIVE] as const).optional(),
});

export type UpdateRoleInput = z.infer<typeof updateRoleSchema>;
export type UpdateStatusInput = z.infer<typeof updateStatusSchema>;
export type ListUsersQuery = z.infer<typeof listUsersQuerySchema>;
