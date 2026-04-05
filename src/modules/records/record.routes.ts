// src/modules/records/record.routes.ts

import { Router } from "express";
import { authenticate } from "../../middleware/authenticate";
import { authorize } from "../../middleware/authorize";
import { validate } from "../../middleware/validate";
import { Role } from "../../constants/roles";
import { createRecordSchema, updateRecordSchema, listRecordsQuerySchema } from "./record.schema";
import { postRecord, getRecords, getRecord, putRecord, removeRecord } from "./record.controller";

const router = Router();

router.use(authenticate);

/**
 * @route   POST /api/records
 * @desc    Create a new financial record
 * @access  Admin
 */
router.post("/", authorize(Role.ADMIN), validate(createRecordSchema), postRecord);

/**
 * @route   GET /api/records
 * @desc    List records with optional filters (type, category, date range) and pagination
 * @access  Admin, Analyst, Viewer
 */
router.get(
  "/",
  authorize(Role.ADMIN, Role.ANALYST, Role.VIEWER),
  validate(listRecordsQuerySchema, "query"),
  getRecords
);

/**
 * @route   GET /api/records/:id
 * @desc    Get a single financial record
 * @access  Admin, Analyst, Viewer
 */
router.get("/:id", authorize(Role.ADMIN, Role.ANALYST, Role.VIEWER), getRecord);

/**
 * @route   PUT /api/records/:id
 * @desc    Update a financial record
 * @access  Admin
 */
router.put("/:id", authorize(Role.ADMIN), validate(updateRecordSchema), putRecord);

/**
 * @route   DELETE /api/records/:id
 * @desc    Delete a financial record
 * @access  Admin
 */
router.delete("/:id", authorize(Role.ADMIN), removeRecord);

export default router;
