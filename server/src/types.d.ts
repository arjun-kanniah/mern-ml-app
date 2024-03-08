// src/types.d.ts

import { Request } from 'express';

export interface UserPayload {
  id: string;
  // Include any other properties that are in the JWT payload
}

// Extend the Express Request type to include the user property
export interface RequestWithUser extends Request {
  user?: UserPayload;
}
