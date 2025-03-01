import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('nonce')
  @ApiOperation({ summary: 'Get nonce for wallet authentication' })
  @ApiResponse({ status: 200, description: 'Returns nonce for signing' })
  async getNonce(@Body('walletAddress') walletAddress: string) {
    if (!walletAddress) {
      throw new UnauthorizedException('Wallet address is required');
    }
    const nonce = await this.authService.generateNonce(walletAddress);
    return { nonce };
  }

  @Post('verify')
  @ApiOperation({ summary: 'Verify wallet signature and get JWT token' })
  @ApiResponse({ status: 200, description: 'Returns JWT token' })
  async verifySignature(
    @Body('walletAddress') walletAddress: string,
    @Body('signature') signature: string,
  ) {
    if (!walletAddress || !signature) {
      throw new UnauthorizedException('Wallet address and signature are required');
    }
    const token = await this.authService.verifySignature(walletAddress, signature);
    return { token };
  }
}
