import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { TypeOrmModuleOptions } from '@nestjs/typeorm';


@Injectable()
export class DatabaseConfig{
  /**
   *  TypeOrmModuleOptions
   *  https://github.com/typestack/typeorm/blob/master/src/connection/options/TypeOrmModuleOptions.ts
   *  https://docs.nestjs.com/techniques/database#typeorm-integration
   */
  type: 'postgres';
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  entities: string[];
  synchronize: boolean;

  constructor(private configService: ConfigService) {
    this.type = 'postgres';
    this.host = this.configService.get('DB_HOST', 'localhost');
    this.port = this.configService.get('DB_PORT', 5432);
    this.username = this.configService.get('DB_USERNAME', 'postgres');
    this.password = this.configService.get('DB_PASSWORD', '');
    this.database = this.configService.get('DB_DATABASE', 'meme_genix');
    this.entities = ['dist/**/*.entity{.ts,.js}'];
    this.synchronize = this.configService.get('DB_SYNC', false);
  }
}
