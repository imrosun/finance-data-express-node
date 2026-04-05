// src/modules/records/record.controller.ts

import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { sendSuccess, sendCreated } from "../../utils/response";
import { createRecord, listRecords, getRecordById, updateRecord, deleteRecord } from "./record.service";


export const postRecord = asyncHandler(async (req: Request, res: Response) => {
  const record = await createRecord(req.body, req.user!.id);
  sendCreated(res, record, "Record created successfully");
});

export const getRecords = asyncHandler(async (req: Request, res: Response) => {
  const result = await listRecords(req.query as any);
  sendSuccess(res, result.records, "Records fetched successfully", 200, result.pagination);
});

export const getRecord = asyncHandler(async (req: Request, res: Response) => {
  const record = await getRecordById(req.params.id as string);
  sendSuccess(res, record, "Record fetched successfully");
});

export const putRecord = asyncHandler(async (req: Request, res: Response) => {
  const record = await updateRecord(req.params.id as string, req.body);
  sendSuccess(res, record, "Record updated successfully");
});

export const removeRecord = asyncHandler(async (req: Request, res: Response) => {
  const result = await deleteRecord(req.params.id as string);
  sendSuccess(res, result, "Record deleted successfully");
});
