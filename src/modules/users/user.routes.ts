// src/modules/users/user.routes.ts

import { Router } from "express";
import { authenticate } from "../../middleware/authenticate";
import { authorize } from "../../middleware/authorize";
import { validate } from "../../middleware/validate";
import { Role } from "../../constants/roles";
import { updateRoleSchema, updateStatusSchema, listUsersQuerySchema } from "./user.schema";
import { getUsers, getUser, patchUserRole, patchUserStatus } from "./user.controller";

const router = Router();

// All user management routes require authentication
router.use(authenticate);

/**
 * @route   GET /api/users
 * @desc    List all users with optional filters and pagination
 * @access  Admin
 */
router.get("/", authorize(Role.ADMIN), validate(listUsersQuerySchema, "query"), getUsers);

/**
 * @route   GET /api/users/:id
 * @desc    Get a single user by ID
 * @access  Admin
 */
router.get("/:id", authorize(Role.ADMIN), getUser);

/**
 * @route   PATCH /api/users/:id/role
 * @desc    Change a user's role
 * @access  Admin
 */
router.patch("/:id/role", authorize(Role.ADMIN), validate(updateRoleSchema), patchUserRole);

/**
 * @route   PATCH /api/users/:id/status
 * @desc    Activate or deactivate a user
 * @access  Admin
 */
router.patch("/:id/status", authorize(Role.ADMIN), validate(updateStatusSchema), patchUserStatus);

export default router;
