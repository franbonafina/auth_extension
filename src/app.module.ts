import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CofeeModule } from './cofee/cofee.module';

@Module({
  imports: [CofeeModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
