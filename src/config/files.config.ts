import { ConfigType, registerAs } from "@nestjs/config";

export const filesConfig = registerAs('files', () => ({
  uploadDest: 'uploads',
  hashAlgorithm: 'sha256'
}))

export type FilesConfig = ConfigType<typeof filesConfig>