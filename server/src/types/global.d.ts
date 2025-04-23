// Ensure Node.js types are available
/// <reference types="node" />

// Extend Express Request type
import { UserDocument } from "../models/User.js";

declare global {
  namespace Express {
    interface Request {
      user?: UserDocument;
    }
  }
}