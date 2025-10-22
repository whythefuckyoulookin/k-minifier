import { Module } from '@nestjs/common';
import { CssModule } from './css/css.module';

@Module({
  imports: [CssModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
