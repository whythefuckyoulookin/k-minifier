import { ConfigType, registerAs } from "@nestjs/config";
import type { LoggerOptions } from "winston";
import winston from "winston";

export const loggerConfig = registerAs('logger', () => ({
  format: winston.format.simple()
} satisfies LoggerOptions))

export type LoggerConfig = ConfigType<typeof loggerConfig>