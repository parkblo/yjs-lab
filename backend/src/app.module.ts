import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { YjsModule } from './yjs/yjs.module';
import { LoggerModule } from './common/logger/logger.module';

@Module({
  imports: [YjsModule, LoggerModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
