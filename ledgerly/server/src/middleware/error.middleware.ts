import { Request, Response, NextFunction } from "express";

export function errorHandler(
  error: any,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  console.error("Error:", error);

  // Prisma-safe check (no typing issues)
  if (
    error &&
    typeof error === "object" &&
    "code" in error &&
    typeof (error as any).code === "string"
  ) {
    return res.status(400).json({
      success: false,
      message: (error as any).message,
      code: (error as any).code,
    });
  }

  return res.status(500).json({
    success: false,
    message: error?.message || "Internal server error",
  });
}
