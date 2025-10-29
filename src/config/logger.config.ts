import { ConfigType, registerAs } from "@nestjs/config";
import type { LoggerOptions } from "winston";
import winston, { format, transports } from "winston";
import "winston-daily-rotate-file"

export const loggerConfig = registerAs('logger', () => ({
  format: winston.format.json(),
  transports: [
    new transports.DailyRotateFile({
      filename: 'err-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      level: 'error',
      maxFiles: '30d',
      dirname: 'logs',
      handleExceptions: true,
      handleRejections: true,
    }),
    new transports.DailyRotateFile({
      filename: 'app-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      level: 'info',
      maxFiles: '30d',
      dirname: 'logs',
      format: format((info) => {
        if (info.level === 'error')
          return false
        return info
      })(),
      handleExceptions: false,
      handleRejections: false,
    })
  ],
} satisfies LoggerOptions))

export type LoggerConfig = ConfigType<typeof loggerConfig>