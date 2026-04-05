// src/modules/users/user.controller.ts

import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { sendSuccess } from "../../utils/response";
import { listUsers, getUserById, updateUserRole, updateUserStatus } from "./user.service";


export const getUsers = asyncHandler(async (req: Request, res: Response) => {
  const result = await listUsers(req.query as any);
  sendSuccess(res, result.users, "Users fetched successfully", 200, result.pagination);
});

export const getUser = asyncHandler(async (req: Request, res: Response) => {
  const user = await getUserById(req.params.id as string);
  sendSuccess(res, user, "User fetched successfully");
});

export const patchUserRole = asyncHandler(async (req: Request, res: Response) => {
  const user = await updateUserRole(req.params.id as string, req.body, req.user!.id);
  sendSuccess(res, user, "User role updated successfully");
});

export const patchUserStatus = asyncHandler(async (req: Request, res: Response) => {
  const user = await updateUserStatus(req.params.id as string, req.body, req.user!.id);
  sendSuccess(res, user, "User status updated successfully");
});
