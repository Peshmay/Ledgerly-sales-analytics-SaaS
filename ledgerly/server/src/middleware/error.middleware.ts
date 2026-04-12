import { Request, Response, NextFunction } from "express";
import { Prisma } from "@prisma/client";

export function errorHandler(
  error: any, // 👈 IMPORTANT (not Error)
  req: Request,
  res: Response,
  next: NextFunction,
) {
  console.error("Error:", error);

  // Prisma errors
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    // Unique constraint
    if (error.code === "P2002") {
      return res.status(400).json({
        success: false,
        message: "A record with this data already exists",
      });
    }

    // Generic Prisma fallback (THIS is what you were missing)
    return res.status(400).json({
      success: false,
      message: error.message,
      code: error.code,
    });
  }

  // Default fallback
  return res.status(500).json({
    success: false,
    message: "Internal server error",
  });
}
