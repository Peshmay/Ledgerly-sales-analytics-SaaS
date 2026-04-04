import { Request, Response } from "express";
import { ZodError } from "zod";
import { createSaleSchema } from "./sales.schema";
import { createSale, getSales } from "./sales.service";

type AuthenticatedRequest = Request & {
  user?: {
    userId: string;
    email: string;
    role: "ADMIN" | "STAFF";
  };
};

export async function createSaleHandler(
  req: AuthenticatedRequest,
  res: Response,
) {
  try {
    const data = createSaleSchema.parse(req.body);

    if (!req.user?.userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const sale = await createSale({
      soldById: req.user.userId,
      data,
    });

    return res.status(201).json({
      success: true,
      message: "Sale created successfully",
      data: sale,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: error.issues,
      });
    }

    return res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : "Failed to create sale",
    });
  }
}

export async function getSalesHandler(_req: Request, res: Response) {
  const sales = await getSales();

  return res.status(200).json({
    success: true,
    data: sales,
  });
}
