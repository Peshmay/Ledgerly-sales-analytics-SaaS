import { Request, Response } from "express";
import { getDashboardOverview } from "./dashboard.service";

export async function getDashboardOverviewHandler(
  _req: Request,
  res: Response,
) {
  try {
    const overview = await getDashboardOverview();

    return res.status(200).json({
      success: true,
      data: overview,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to load dashboard overview.",
    });
  }
}
