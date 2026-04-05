import { Request, Response, NextFunction } from "express";
import { Prisma } from "@prisma/client";

export function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error("Error:", error);

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      return res.status(400).json({
        success: false,
        message: "A record with this data already exists",
      });
    }
  }

  return res.status(500).json({
    success: false,
    message: "Internal server error",
  });
}
