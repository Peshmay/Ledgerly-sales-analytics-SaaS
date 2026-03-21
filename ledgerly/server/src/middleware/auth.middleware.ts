import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../utils/jwt";

type AuthenticatedRequest = Request & {
  user?: {
    userId: string;
    email: string;
    role: "ADMIN" | "STAFF";
  };
};

export function authenticate(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
}
