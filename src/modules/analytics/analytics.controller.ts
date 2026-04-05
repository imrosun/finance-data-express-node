// src/modules/analytics/analytics.controller.ts

import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { sendSuccess } from "../../utils/response";
import {
  getSummary,
  getCategoryTotals,
  getRecentActivity,
  getMonthlyTrends,
} from "./analytics.service";

export const summary = asyncHandler(async (_req: Request, res: Response) => {
  const data = await getSummary();
  sendSuccess(res, data, "Summary fetched successfully");
});

export const categoryTotals = asyncHandler(async (_req: Request, res: Response) => {
  const data = await getCategoryTotals();
  sendSuccess(res, data, "Category totals fetched successfully");
});

export const recentActivity = asyncHandler(async (req: Request, res: Response) => {
  const { limit } = req.query as any;
  const data = await getRecentActivity(limit);
  sendSuccess(res, data, "Recent activity fetched successfully");
});

export const monthlyTrends = asyncHandler(async (_req: Request, res: Response) => {
  const data = await getMonthlyTrends();
  sendSuccess(res, data, "Monthly trends fetched successfully");
});
