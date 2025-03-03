import { Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseService } from './supabase.service';
import { User, UserUpdateInput } from '../types/user.types';

@Injectable()
export class UserService {
  constructor(private supabaseService: SupabaseService) {}

  async getUserById(id: string): Promise<User> {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('users')
      .select()
      .eq('id', id)
      .single();

    if (error || !data) {
      throw new NotFoundException('User not found');
    }

    return data;
  }

  async updateUser(id: string, updateData: UserUpdateInput): Promise<User> {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('users')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error || !data) {
      throw new NotFoundException('User not found or update failed');
    }

    return data;
  }
}
