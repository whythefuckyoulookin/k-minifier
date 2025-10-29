import { ConfigType, registerAs } from "@nestjs/config";
import { CustomAtRules, TransformOptions } from "lightningcss";

const lightningcssOptions = {
  sourceMap: false,
  minify: true,
  
} satisfies Omit<TransformOptions<CustomAtRules>, 'code' | 'filename'>

export const cssConfig = registerAs('css', () => ({
  minifiedCssDest: '__minified__',
  lightningcssOptions
}))

export type CssConfig = ConfigType<typeof cssConfig>