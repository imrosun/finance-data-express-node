// src/utils/response.ts
// Standardized API response helpers to ensure a consistent JSON envelope shape
// across all endpoints: { success, message, data, pagination? }

import { Response } from "express";

interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export function sendSuccess<T>(
  res: Response,
  data: T,
  message = "Success",
  statusCode = 200,
  pagination?: PaginationMeta
) {
  res.status(statusCode).json({
    success: true,
    message,
    data,
    ...(pagination && { pagination }),
  });
}

export function sendCreated<T>(res: Response, data: T, message = "Created successfully") {
  sendSuccess(res, data, message, 201);
}
