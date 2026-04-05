/**
 * Helper to safely extract a single string from Express query parameters.
 * Handles cases where a query param is a string, an array of strings, or undefined.
 */
export function qs(val: unknown): string | undefined {
  if (typeof val === "string") return val;
  if (Array.isArray(val)) return typeof val[0] === "string" ? val[0] : undefined;
  return undefined;
}
