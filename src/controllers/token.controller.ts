import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { TokenService } from '../services/token.service';
import { TokenCreateInput } from '../types/token.types';

@Controller('tokens')
export class TokenController {
  constructor(private tokenService: TokenService) {}

  @Post()
  async createToken(
    @Body('userId') userId: string,
    @Body() tokenData: TokenCreateInput,
  ) {
    return this.tokenService.createToken(userId, tokenData);
  }

  @Get('user/:userId')
  async getUserTokens(@Param('userId') userId: string) {
    return this.tokenService.getTokensByUser(userId);
  }
}
