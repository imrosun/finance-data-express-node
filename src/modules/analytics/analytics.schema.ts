import { z } from "zod";

export const recentActivityQuerySchema = z.object({
  limit: z.coerce.number().int().positive().max(50).default(10),
});

export type RecentActivityQuery = z.infer<typeof recentActivityQuerySchema>;
