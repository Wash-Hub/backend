import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppConfigModule } from './common/config/config.module';
import { UserModule } from './user/user.module';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { MapModule } from './map/map.module';

@Module({
  imports: [AppConfigModule, UserModule, DatabaseModule, AuthModule, MapModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
