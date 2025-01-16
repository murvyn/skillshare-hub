import { createLogger, transports, format } from "winston";
import "dotenv/config";

export const logger = createLogger({
  level: "info", // Default log level
  format: format.combine(
    format.timestamp(), // Add timestamp
    format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level}]: ${message}`; // Custom format
    })
  ),
  transports: [
    new transports.Console({
      format: format.colorize(), // Colorize console output
    }),
    new transports.File({ filename: "logger.log" }),
  ],
  exceptionHandlers: [
    new transports.Console(),
    new transports.File({ filename: "exceptions.log" }),
  ],
  rejectionHandlers: [
    new transports.Console(),
    new transports.File({ filename: "exceptions.log" }),
  ],
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason) => {
  logger.error(`Unhandled Rejection: ${reason}`);
});