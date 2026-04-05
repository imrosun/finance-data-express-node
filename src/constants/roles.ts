// src/constants/roles.ts
// Single source of truth for all roles, statuses, and record types used across the app.

export const Role = {
  VIEWER: "VIEWER",
  ANALYST: "ANALYST",
  ADMIN: "ADMIN",
} as const;

export type Role = (typeof Role)[keyof typeof Role];

export const UserStatus = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
} as const;

export type UserStatus = (typeof UserStatus)[keyof typeof UserStatus];

export const RecordType = {
  INCOME: "INCOME",
  EXPENSE: "EXPENSE",
} as const;

export type RecordType = (typeof RecordType)[keyof typeof RecordType];
