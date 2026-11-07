import { createApp } from "./app";
import { env } from "./config/env";
import { logger } from "./lib/logger";

const app = createApp();

const server = app.listen(env.PORT, "0.0.0.0", () => {
  logger.info({ port: env.PORT, nodeEnv: env.NODE_ENV }, "API listening");
});

function shutdown(signal: string) {
  logger.info({ signal }, "shutting down");
  server.close((error) => {
    if (error) {
      logger.error({ err: error }, "failed to close server");
      process.exit(1);
    }
    process.exit(0);
  });

  setTimeout(() => {
    logger.error("forced shutdown after timeout");
    process.exit(1);
  }, 10_000).unref();
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
