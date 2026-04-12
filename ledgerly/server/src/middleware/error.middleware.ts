import { Request, Response, NextFunction } from "express";
import { Prisma } from "@prisma/client";

export function errorHandler(
  error: any,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  console.error("Error:", error);

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return res.status(400).json({
      success: false,
      message: error.message,
      code: error.code,
    });
  }

  return res.status(500).json({
    success: false,
    message: "Internal server error",
  });
}
