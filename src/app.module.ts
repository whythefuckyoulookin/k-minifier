import { Module } from '@nestjs/common';
import { CssModule } from './css/css.module';
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [SharedModule, CssModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
