import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SupabaseService } from './supabase.service';
import { User } from '../types/user.types';
import { ethers } from 'ethers';

@Injectable()
export class AuthService {
  constructor(private supabaseService: SupabaseService) {}

  async signInWithGithub(code: string) {
    const { data, error } = await this.supabaseService
      .getClient()
      .auth.exchangeCodeForSession(code);

    if (error) {
      throw new UnauthorizedException(error.message);
    }

    await this.createUserIfNotExists(data.user);
    return data;
  }

  async signInWithWallet(message: string, signature: string) {
    try {
      const signerAddress = ethers.verifyMessage(message, signature);
      
      const { data: existingUser, error: searchError } = await this.supabaseService
        .getClient()
        .from('users')
        .select()
        .eq('wallet_address', signerAddress)
        .single();

      if (searchError && searchError.code !== 'PGRST116') {
        throw new UnauthorizedException(searchError.message);
      }

      if (!existingUser) {
        const { data: newUser, error: createError } = await this.supabaseService
          .getClient()
          .from('users')
          .insert({
            wallet_address: signerAddress,
            username: `user_${signerAddress.slice(2, 8)}`,
          })
          .select()
          .single();

        if (createError) {
          throw new UnauthorizedException(createError.message);
        }

        return newUser;
      }

      return existingUser;
    } catch (error) {
      throw new UnauthorizedException('Invalid signature');
    }
  }

  private async createUserIfNotExists(authUser: any) {
    const { data: existingUser } = await this.supabaseService
      .getClient()
      .from('users')
      .select()
      .eq('github_id', authUser.user_metadata.sub)
      .single();

    if (!existingUser) {
      await this.supabaseService
        .getClient()
        .from('users')
        .insert({
          github_id: authUser.user_metadata.sub,
          username: authUser.user_metadata.user_name,
          email: authUser.email,
          avatar_url: authUser.user_metadata.avatar_url,
        });
    }
  }
}
