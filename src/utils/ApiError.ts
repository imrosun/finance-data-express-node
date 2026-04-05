// src/utils/ApiError.ts
// A custom error class that carries an HTTP status code and optional error details.
// Thrown from controllers/services and caught by the global error handler.

export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly details?: unknown;

  constructor(statusCode: number, message: string, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.details = details;

    // Maintains proper stack trace for V8 environments
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError);
    }
  }

  static badRequest(message: string, details?: unknown) {
    return new ApiError(400, message, details);
  }

  static unauthorized(message = "Unauthorized") {
    return new ApiError(401, message);
  }

  static forbidden(message = "Forbidden: insufficient permissions") {
    return new ApiError(403, message);
  }

  static notFound(message: string) {
    return new ApiError(404, message);
  }

  static conflict(message: string) {
    return new ApiError(409, message);
  }

  static internal(message = "Internal server error") {
    return new ApiError(500, message);
  }
}
