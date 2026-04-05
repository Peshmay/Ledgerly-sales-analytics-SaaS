import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware";
import { getDashboardOverviewHandler } from "./dashboard.controller";

export const dashboardRouter = Router();

dashboardRouter.get("/overview", authenticate, getDashboardOverviewHandler);
