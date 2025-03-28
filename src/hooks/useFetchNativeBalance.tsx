'use client';

import { useAccount } from 'wagmi';
import { useState, useEffect } from 'react';
import { formatUnits } from 'viem';
import { sepolia, zetachainAthensTestnet } from 'wagmi/chains';
import { getAlchemyBaseUrl } from '../utils';
import { Token } from '@/interfaces';
import { ALCHEMY_PRICE_API_URL, TestnetToMainnetTokenMap } from '@/constants';

const NATIVE_TOKENS = {
  [sepolia.id]: {
    name: 'Sepolia Ether',
    symbol: 'ETH',
    decimals: 18,
    logo: '',
    network: sepolia.name,
    address: '0x0',
    mainnetAddress: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
  },
  [zetachainAthensTestnet.id]: {
    name: 'ZETA',
    symbol: 'ZETA',
    decimals: 18,
    logo: '',
    network: zetachainAthensTestnet.name,
    address: '0x0',
    mainnetAddress: '0xf72a3beE4c78EA0Cfc63F3BD42D189B6D4425d76',
  },
};

const fetchNativeBalance = async (
  walletAddress: string,
  chainId: number
): Promise<Token | null> => {
  try {
    const baseUrl = getAlchemyBaseUrl(chainId);

    const balanceResponse = await fetch(`${baseUrl}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'eth_getBalance',
        params: [walletAddress, 'latest'],
      }),
    });

    const balanceData = await balanceResponse.json();

    if (balanceData.error) {
      console.error('Error fetching balance:', balanceData.error);
      return null;
    }

    const balance = balanceData.result;

    if (!balance) {
      console.error('Invalid balance received:', balance);
      return null;
    }

    const tokenConfig = NATIVE_TOKENS[chainId as keyof typeof NATIVE_TOKENS];

    if (!tokenConfig) {
      console.error('error', chainId);
      return null;
    }

    const formattedBalance = formatUnits(BigInt(balance), tokenConfig.decimals);

    return {
      address: tokenConfig.address,
      balance,
      formattedBalance,
      decimals: tokenConfig.decimals,
      name: tokenConfig.name,
      symbol: tokenConfig.symbol,
      logo: tokenConfig.logo,
      chainId,
      network: tokenConfig.network,
    };
  } catch (error) {
    console.error(`error fetching native balance:`, error);
    return null;
  }
};

const fetchNativeTokenPrices = async (tokens: Token[]) => {
  if (!tokens.length) return { data: [] };

  try {
    const addresses = tokens.map((token) => {
      if (!token || token.chainId === undefined) {
        return {
          network:
            token.chainId === sepolia.id ? 'eth-mainnet' : 'zetachain-mainnet',
          address:
            TestnetToMainnetTokenMap[
              token.address as keyof typeof TestnetToMainnetTokenMap
            ],
        };
      }

      const nativeConfig =
        NATIVE_TOKENS[token.chainId as keyof typeof NATIVE_TOKENS];

      if (!nativeConfig) {
        console.error('err', token.chainId);
        return {
          network: 'eth-mainnet',
          address: token.address || '0x0',
        };
      }

      return {
        network:
          token.chainId === sepolia.id
            ? 'eth-mainnet'
            : token.chainId === zetachainAthensTestnet.id
            ? 'zetachain-mainnet'
            : 'eth-mainnet', // default to mainnet
        address: nativeConfig.mainnetAddress || token.address,
      };
    });

    const response = await fetch(ALCHEMY_PRICE_API_URL, {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
      },
      body: JSON.stringify({ addresses }),
    });

    const priceData = await response.json();
    return priceData;
  } catch (error) {
    console.error('error fetching native token prices:', error);
    return { data: [] };
  }
};

export function useFetchNativeTokens() {
  const { address, isConnected, chainId } = useAccount();
  const [nativeTokens, setNativeTokens] = useState<Token[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!isConnected || !address || !chainId) {
      return;
    }

    const fetchNativeTokens = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const allTokens: Token[] = [];
        const nativeToken = await fetchNativeBalance(address, chainId);

        if (nativeToken) {
          allTokens.push(nativeToken);
        }

        if (allTokens.length > 0) {
          const priceData = await fetchNativeTokenPrices(allTokens);

          const tokenPrices = priceData?.data || [];

          const nativeTokensWithPrices = allTokens.map((token, idx) => {
            return {
              ...token,
              priceInUsd: tokenPrices[idx]?.prices?.[0]?.value,
            };
          });

          setNativeTokens(nativeTokensWithPrices);
        } else {
          setNativeTokens([]);
        }
      } catch (e) {
        setError(e instanceof Error ? e : new Error('Unknown error occurred'));
        console.error('error fetching native tokens:', e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNativeTokens();
  }, [address, isConnected, chainId]);

  const totalNativeValueInUsd = nativeTokens.reduce((sum, token) => {
    if (token.priceInUsd && token.formattedBalance) {
      return sum + token.priceInUsd * parseFloat(token.formattedBalance);
    }
    return sum;
  }, 0);

  return {
    data: nativeTokens,
    isLoading,
    error,
    totalNativeValueInUsd,
    refetch: () => {
      if (isConnected && address && chainId) {
        setIsLoading(true);
      }
    },
  };
}
