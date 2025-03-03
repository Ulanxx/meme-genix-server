export interface User {
  id: string;
  username: string;
  email?: string;
  wallet_address?: string;
  github_id?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface UserUpdateInput {
  username?: string;
  email?: string;
  avatar_url?: string;
}
