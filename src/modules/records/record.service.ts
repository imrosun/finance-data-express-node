// src/modules/records/record.service.ts
// Business logic for creating, reading, updating, and deleting financial records.

import { prisma } from "../../config/prisma";
import { ApiError } from "../../utils/ApiError";
import type { CreateRecordInput, UpdateRecordInput, ListRecordsQuery } from "./record.schema";

export async function createRecord(input: CreateRecordInput, userId: string) {
  return prisma.record.create({
    data: {
      ...input,
      userId,
    },
  });
}

export async function listRecords(query: ListRecordsQuery) {
  const page = query.page ?? 1;
  const limit = query.limit ?? 10;
  const skip = (page - 1) * limit;

  const { type, category, startDate, endDate } = query;

  const where = {
    ...(type && { type }),
    ...(category && { category: { contains: category } }),
    ...(startDate || endDate
      ? {
          date: {
            ...(startDate && { gte: startDate }),
            ...(endDate && { lte: endDate }),
          },
        }
      : {}),
  };

  const [records, total] = await prisma.$transaction([
    prisma.record.findMany({
      where,
      skip,
      take: limit,
      orderBy: { date: "desc" },
      include: {
        user: {
          select: { id: true, email: true },
        },
      },
    }),
    prisma.record.count({ where }),
  ]);

  return {
    records,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getRecordById(id: string) {
  const record = await prisma.record.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, email: true } },
    },
  });
  if (!record) throw ApiError.notFound(`Record with ID "${id}" not found.`);
  return record;
}

export async function updateRecord(id: string, input: UpdateRecordInput) {
  const existing = await prisma.record.findUnique({ where: { id } });
  if (!existing) throw ApiError.notFound(`Record with ID "${id}" not found.`);

  return prisma.record.update({
    where: { id },
    data: input,
  });
}

export async function deleteRecord(id: string) {
  const existing = await prisma.record.findUnique({ where: { id } });
  if (!existing) throw ApiError.notFound(`Record with ID "${id}" not found.`);

  await prisma.record.delete({ where: { id } });
  return { id };
}
