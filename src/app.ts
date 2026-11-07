import cors from "cors";
import express from "express";
import helmet from "helmet";
import pinoHttp from "pino-http";
import { env } from "./config/env";
import { logger } from "./lib/logger";
import { errorHandler, notFound } from "./middleware/error";
import { contentRouter } from "./routes/content";
import { healthRouter } from "./routes/health";
import { writingRouter } from "./routes/writing";

export function createApp() {
  const app = express();

  app.disable("x-powered-by");
  app.use(helmet());
  app.use(
    cors({
      origin: env.corsOrigins,
      methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
      credentials: false,
    }),
  );
  app.use(express.json({ limit: "1mb" }));
  app.use(pinoHttp({ logger }));

  app.get("/", (_request, response) => {
    response.json({ service: "language-be", status: "ok" });
  });
  app.use("/health", healthRouter);
  app.use("/v1/health", healthRouter);
  app.use("/v1", contentRouter);
  app.use("/v1/writing", writingRouter);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
