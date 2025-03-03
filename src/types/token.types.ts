export interface Token {
  id: string;
  name: string;
  symbol: string;
  creator_id: string;
  contract_address?: string;
  total_supply: string;
  created_at: string;
  updated_at: string;
}

export interface TokenCreateInput {
  name: string;
  symbol: string;
  total_supply: string;
}
