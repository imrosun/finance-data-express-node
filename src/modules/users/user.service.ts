// src/modules/users/user.service.ts
// Business logic for user management (Admin only operations).

import { prisma } from "../../config/prisma";
import { ApiError } from "../../utils/ApiError";
import type { UpdateRoleInput, UpdateStatusInput, ListUsersQuery } from "./user.schema";

// Fields to always return — never expose passwordHash
const SELECT_SAFE_FIELDS = {
  id: true,
  email: true,
  role: true,
  status: true,
  createdAt: true,
  updatedAt: true,
};

export async function listUsers(query: ListUsersQuery) {
  const page = query.page ?? 1;
  const limit = query.limit ?? 10;
  const skip = (page - 1) * limit;

  const { role, status } = query;

  const where = {
    ...(role && { role }),
    ...(status && { status }),
  };

  const [users, total] = await prisma.$transaction([
    prisma.user.findMany({
      where,
      select: SELECT_SAFE_FIELDS,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.user.count({ where }),
  ]);

  return {
    users,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getUserById(id: string) {
  const user = await prisma.user.findUnique({
    where: { id },
    select: SELECT_SAFE_FIELDS,
  });
  if (!user) throw ApiError.notFound(`User with ID "${id}" not found.`);
  return user;
}

export async function updateUserRole(id: string, input: UpdateRoleInput, requesterId: string) {
  if (id === requesterId) {
    throw ApiError.badRequest("You cannot change your own role.");
  }

  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw ApiError.notFound(`User with ID "${id}" not found.`);

  return prisma.user.update({
    where: { id },
    data: { role: input.role },
    select: SELECT_SAFE_FIELDS,
  });
}

export async function updateUserStatus(id: string, input: UpdateStatusInput, requesterId: string) {
  if (id === requesterId) {
    throw ApiError.badRequest("You cannot change your own account status.");
  }

  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw ApiError.notFound(`User with ID "${id}" not found.`);

  return prisma.user.update({
    where: { id },
    data: { status: input.status },
    select: SELECT_SAFE_FIELDS,
  });
}
