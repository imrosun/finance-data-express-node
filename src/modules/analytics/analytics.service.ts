// src/modules/analytics/analytics.service.ts
// Aggregation logic for dashboard-level summaries. Uses Prisma groupBy and
// raw aggregates for efficiency rather than loading all records into memory.

import { prisma } from "../../config/prisma";
import { RecordType } from "../../constants/roles";

interface CategoryTotalRow {
  category: string;
  type: string;
  _sum: { amount: number | null };
  _count: { id: number };
}

export async function getSummary() {
  const [incomeAgg, expenseAgg] = await Promise.all([
    prisma.record.aggregate({
      where: { type: RecordType.INCOME },
      _sum: { amount: true },
      _count: { id: true },
    }),
    prisma.record.aggregate({
      where: { type: RecordType.EXPENSE },
      _sum: { amount: true },
      _count: { id: true },
    }),
  ]);

  const totalIncome = incomeAgg._sum.amount ?? 0;
  const totalExpenses = expenseAgg._sum.amount ?? 0;

  return {
    totalIncome,
    totalExpenses,
    netBalance: totalIncome - totalExpenses,
    totalIncomeRecords: incomeAgg._count.id,
    totalExpenseRecords: expenseAgg._count.id,
  };
}

export async function getCategoryTotals() {
  const results = await prisma.record.groupBy({
    by: ["category", "type"],
    _sum: { amount: true },
    _count: { id: true },
    orderBy: { _sum: { amount: "desc" } },
  });

  return (results as CategoryTotalRow[]).map((r) => ({
    category: r.category,
    type: r.type,
    total: r._sum.amount ?? 0,
    count: r._count.id,
  }));
}

export async function getRecentActivity(limit = 10) {
  return prisma.record.findMany({
    take: limit,
    orderBy: { date: "desc" },
    include: {
      user: { select: { id: true, email: true } },
    },
  });
}

export async function getMonthlyTrends() {
  // SQLite does not support date_trunc, so we aggregate in JS
  const records = await prisma.record.findMany({
    select: { amount: true, type: true, date: true },
    orderBy: { date: "asc" },
  });

  const monthMap: Record<string, { month: string; income: number; expenses: number }> = {};

  for (const record of records) {
    const month = record.date.toISOString().slice(0, 7); // "YYYY-MM"
    if (!monthMap[month]) {
      monthMap[month] = { month, income: 0, expenses: 0 };
    }
    if (record.type === RecordType.INCOME) {
      monthMap[month].income += record.amount;
    } else {
      monthMap[month].expenses += record.amount;
    }
  }

  return Object.values(monthMap);
}
