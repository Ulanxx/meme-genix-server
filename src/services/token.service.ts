import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SupabaseService } from './supabase.service';
import { Token, TokenCreateInput } from '../types/token.types';
import { ethers } from 'ethers';

@Injectable()
export class TokenService {
  private provider: ethers.JsonRpcProvider;

  constructor(
    private supabaseService: SupabaseService,
    private configService: ConfigService,
  ) {
    this.provider = new ethers.JsonRpcProvider(
      this.configService.get('BLOCKCHAIN_RPC_URL'),
    );
  }

  async createToken(userId: string, tokenData: TokenCreateInput): Promise<Token> {
    // First create token record in database
    const { data: token, error } = await this.supabaseService
      .getClient()
      .from('tokens')
      .insert({
        name: tokenData.name,
        symbol: tokenData.symbol,
        total_supply: tokenData.total_supply,
        creator_id: userId,
      })
      .select()
      .single();

    if (error) {
      throw new BadRequestException('Failed to create token record');
    }

    try {
      // Deploy contract
      // Note: This is a simplified version. In production, you'd want to:
      // 1. Use a proper contract factory
      // 2. Handle gas estimation
      // 3. Implement proper error handling
      // 4. Add contract verification
      // 5. Possibly use a queue for contract deployment
      
      // Update token record with contract address
      const { data: updatedToken, error: updateError } = await this.supabaseService
        .getClient()
        .from('tokens')
        .update({
          contract_address: "0x..." // Add deployed contract address here
        })
        .eq('id', token.id)
        .select()
        .single();

      if (updateError) {
        throw new BadRequestException('Failed to update token record');
      }

      return updatedToken;
    } catch (error) {
      // If contract deployment fails, delete the token record
      await this.supabaseService
        .getClient()
        .from('tokens')
        .delete()
        .eq('id', token.id);

      throw new BadRequestException('Failed to deploy token contract');
    }
  }

  async getTokensByUser(userId: string): Promise<Token[]> {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('tokens')
      .select()
      .eq('creator_id', userId);

    if (error) {
      throw new BadRequestException('Failed to fetch tokens');
    }

    return data;
  }
}
