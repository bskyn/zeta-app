'use client';

import '@rainbow-me/rainbowkit/styles.css';

import { getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { http, WagmiProvider } from 'wagmi';
import { zetachainAthensTestnet, sepolia } from 'wagmi/chains';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';

const config = getDefaultConfig({
  appName: 'Zeta App',
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_ID!,
  chains: [zetachainAthensTestnet, sepolia],
  ssr: true,
  transports: {
    [zetachainAthensTestnet.id]: http(
      `https://eth-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`
    ),
    [sepolia.id]: http(
      `https://zetachain-testnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`
    ),
  },
});

const queryClient = new QueryClient();

interface WalletProvider {
  children: React.ReactNode;
}

const WalletProvider = ({ children }: WalletProvider) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default WalletProvider;
