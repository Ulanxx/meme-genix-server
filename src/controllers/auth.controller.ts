import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from '../services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('github')
  @HttpCode(HttpStatus.OK)
  async githubAuth(@Body('code') code: string) {
    return this.authService.signInWithGithub(code);
  }

  @Post('wallet')
  @HttpCode(HttpStatus.OK)
  async walletAuth(
    @Body('message') message: string,
    @Body('signature') signature: string,
  ) {
    return this.authService.signInWithWallet(message, signature);
  }
}
