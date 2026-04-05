// src/modules/records/record.schema.ts
// Zod v4 compatible schemas for financial record operations.

import { z } from "zod";
import { RecordType } from "../../constants/roles";

export const createRecordSchema = z.object({
  amount: z
    .number({ error: "Amount must be a number" })
    .positive("Amount must be greater than 0"),
  type: z.enum([RecordType.INCOME, RecordType.EXPENSE] as const, {
    message: "Type must be either INCOME or EXPENSE",
  }),
  category: z.string().min(1, "Category is required").max(100),
  date: z.coerce.date(),
  notes: z.string().max(500, "Notes cannot exceed 500 characters").optional(),
});

export const updateRecordSchema = createRecordSchema.partial();

export const listRecordsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  type: z.enum([RecordType.INCOME, RecordType.EXPENSE] as const).optional(),
  category: z.string().optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
});

export type CreateRecordInput = z.infer<typeof createRecordSchema>;
export type UpdateRecordInput = z.infer<typeof updateRecordSchema>;
export type ListRecordsQuery = z.infer<typeof listRecordsQuerySchema>;
