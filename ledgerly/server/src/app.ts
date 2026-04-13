import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { apiRouter } from "./routes";
import { errorHandler } from "./middleware/error.middleware";

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://ledgerly.peshifytech.com",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  }),
);



app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

app.use("/api", apiRouter);
app.use(errorHandler);

export default app;
