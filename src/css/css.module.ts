import { Module } from "@nestjs/common";
import { CssController } from "./css.controller";
import { CssService } from "./css.service";
import { FilesModule } from "src/files/files.module";
@Module({
  controllers: [CssController],
  providers: [CssService],
  imports: [FilesModule]
})
export class CssModule { }