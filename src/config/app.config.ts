import { ConfigType, registerAs } from "@nestjs/config";
import { SwaggerCustomOptions } from "@nestjs/swagger";

const swaggerOptions = {
  yamlDocumentUrl: "swagger/yaml",
  customSiteTitle: "korzilla/api"
} satisfies SwaggerCustomOptions

export const appConfig = registerAs('app', () => ({
  port: Number(process.env.PORT) || 3000,
  swagger: {
    path: 'swagger',
    options: swaggerOptions
  }
}))

export type AppConfig = ConfigType<typeof appConfig>