import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from '../db/typeorm.config';
import { UsersModule } from './users/users.module';
import jwtConfig from './config/jwt.config';
import { APP_GUARD } from '@nestjs/core';
import { PublicGuard } from './common/guards/public.guard';
import { RolesGuard } from './common/guards/roles.guard';
import { AppointmentsModule } from './appointments/appointments.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [jwtConfig] }),
    TypeOrmModule.forRootAsync(typeOrmConfig),
    UsersModule,
    AppointmentsModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: PublicGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
