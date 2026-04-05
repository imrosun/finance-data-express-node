// src/types/express.d.ts
// Extends the Express Request type to include the authenticated user payload.
// This makes req.user type-safe throughout all controllers and middleware.

import { Role } from "../constants/roles";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: Role;
      };
    }
  }
}
