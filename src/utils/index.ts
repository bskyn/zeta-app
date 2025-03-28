import { sepolia, zetachainAthensTestnet } from 'wagmi/chains';

export const getAlchemyBaseUrl = (chainId: number): string | null => {
  switch (chainId) {
    case sepolia.id:
      return `https://eth-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`;
    case zetachainAthensTestnet.id:
      return `https://zetachain-testnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`;
    default:
      return null;
  }
};
