import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { User } from './modules/users/user.entity';
import { SupabaseConfig } from './config/supabase.config';
import { SupabaseService } from './services/supabase.service';
import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';
import { TokenService } from './services/token.service';
import { AuthController } from './controllers/auth.controller';
import { UserController } from './controllers/user.controller';
import { TokenController } from './controllers/token.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST', 'localhost'),
        port: configService.get('DB_PORT', 5432),
        username: configService.get('DB_USERNAME', 'postgres'),
        password: configService.get('DB_PASSWORD', ''),
        database: configService.get('DB_DATABASE', 'meme_genix'),
        entities: [User],
        synchronize: configService.get('DB_SYNC', false),
      }),
      inject: [ConfigService],
    }),
    AuthModule,
  ],
  controllers: [AuthController, UserController, TokenController],
  providers: [SupabaseConfig, SupabaseService, AuthService, UserService, TokenService],
})
export class AppModule {}
