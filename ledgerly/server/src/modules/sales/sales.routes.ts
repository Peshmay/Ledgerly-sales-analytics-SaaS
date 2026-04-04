import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware";
import { createSaleHandler, getSalesHandler } from "./sales.controller";

export const salesRouter = Router();

salesRouter.use(authenticate);

salesRouter.post("/", createSaleHandler);
salesRouter.get("/", getSalesHandler);