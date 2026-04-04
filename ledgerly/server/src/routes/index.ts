import { Router } from "express";
import { healthRouter } from "./health.routes";
import { authRouter } from "../modules/auth/auth.routes";
import { protectedRouter } from "./protected.routes";
import { ingredientsRouter } from "../modules/ingredients/ingredients.routes";
import { cocktailsRouter } from "../modules/cocktails/cocktails.routes";
import { recipesRouter } from "../modules/recipes/recipes.routes";
import { salesRouter } from "../modules/sales/sales.routes";

export const apiRouter = Router();

apiRouter.use("/health", healthRouter);
apiRouter.use("/auth", authRouter);
apiRouter.use("/protected", protectedRouter);
apiRouter.use("/ingredients", ingredientsRouter);
apiRouter.use("/cocktails", cocktailsRouter);
apiRouter.use("/recipes", recipesRouter);
apiRouter.use("/sales", salesRouter);
