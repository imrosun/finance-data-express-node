// src/modules/analytics/analytics.routes.ts

import { Router } from "express";
import { authenticate } from "../../middleware/authenticate";
import { authorize } from "../../middleware/authorize";
import { Role } from "../../constants/roles";
import { validate } from "../../middleware/validate";
import { recentActivityQuerySchema } from "./analytics.schema";
import { summary, categoryTotals, recentActivity, monthlyTrends } from "./analytics.controller";

const router = Router();

router.use(authenticate);
router.use(authorize(Role.ADMIN, Role.ANALYST)); // Viewers cannot access analytics

/**
 * @route   GET /api/analytics/summary
 * @desc    Get total income, total expenses, and net balance
 * @access  Admin, Analyst
 */
router.get("/summary", summary);

/**
 * @route   GET /api/analytics/categories
 * @desc    Get aggregated totals per category
 * @access  Admin, Analyst
 */
router.get("/categories", categoryTotals);

/**
 * @route   GET /api/analytics/recent
 * @desc    Get recent financial activity (default: 10, max: 50)
 * @access  Admin, Analyst
 */
router.get("/recent", validate(recentActivityQuerySchema, "query"), recentActivity);

/**
 * @route   GET /api/analytics/trends
 * @desc    Get monthly income/expense trends
 * @access  Admin, Analyst
 */
router.get("/trends", monthlyTrends);

export default router;
