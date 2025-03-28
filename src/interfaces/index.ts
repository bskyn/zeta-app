export interface AlchemyTokenBalance {
  contractAddress: string;
  tokenBalance: string;
}

export interface AlchemyTokenMetadata {
  decimals: number;
  logo: string;
  name: string;
  symbol: string;
}

export interface Token {
  symbol: string;
  name: string;
  balance: string;
  decimals: number;
  address: string;
  chainId: number;
  network: string;
  logo?: string;
  price?: number;
  priceInUsd?: number;
  formattedBalance?: string;
}
