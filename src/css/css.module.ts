import { Module } from "@nestjs/common";
import { CssController } from "./css.controller";
import { CssService } from "./css.service";

@Module({
    controllers: [CssController],
    providers: [CssService]
})
export class CssModule { }