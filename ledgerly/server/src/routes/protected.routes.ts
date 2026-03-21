import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";

export const protectedRouter = Router();

protectedRouter.get("/", authenticate, (req, res) => {
  res.status(200).json({
    success: true,
    message: "Protected route accessed successfully",
  });
});
