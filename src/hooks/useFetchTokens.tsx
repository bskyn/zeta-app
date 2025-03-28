'use client';

import { useAccount } from 'wagmi';
import { useState, useEffect } from 'react';
import { formatUnits } from 'viem';
import { sepolia, zetachainAthensTestnet } from 'wagmi/chains';
import { getAlchemyBaseUrl } from '../utils';
import { AlchemyTokenBalance, AlchemyTokenMetadata, Token } from '@/interfaces';
import { ALCHEMY_PRICE_API_URL, TestnetToMainnetTokenMap } from '@/constants';

// fetch all tokens from network
const fetchNetworkTokens = async (walletAddress: string, chainId: number) => {
  try {
    const baseUrl = getAlchemyBaseUrl(chainId);

    const tokenBalancesResponse = await fetch(`${baseUrl}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'alchemy_getTokenBalances',
        params: [walletAddress],
      }),
    });

    const tokenBalancesData = await tokenBalancesResponse.json();

    const tokenBalances: AlchemyTokenBalance[] =
      tokenBalancesData.result.tokenBalances || [];

    const tokenBalancesToFetch = tokenBalances.map(async (tokenBalance) => {
      try {
        const metadataResponse = await fetch(`${baseUrl}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            jsonrpc: '2.0',
            id: 1,
            method: 'alchemy_getTokenMetadata',
            params: [tokenBalance.contractAddress],
          }),
        });

        const metadataData = await metadataResponse.json();
        const metadata: AlchemyTokenMetadata = metadataData.result;

        const balance = BigInt(tokenBalance.tokenBalance);
        const formattedBalance = formatUnits(balance, metadata.decimals);

        return {
          address: tokenBalance.contractAddress,
          balance: balance.toString(),
          formattedBalance,
          decimals: metadata.decimals,
          name: metadata.name,
          symbol: metadata.symbol,
          logo: metadata.logo,
          chainId,
          network:
            chainId === sepolia.id ? sepolia.name : zetachainAthensTestnet.name,
        };
      } catch (err) {
        console.error(`error ${tokenBalance.contractAddress}:`, err);

        // returns an unknown Token object if no data found to handle type error
        return {
          address: tokenBalance.contractAddress,
          balance: tokenBalance.tokenBalance,
          formattedBalance: '0',
          decimals: 18,
          name: 'Unknown Token',
          symbol: '???',
          chainId,
          network:
            chainId === sepolia.id ? sepolia.name : zetachainAthensTestnet.name,
        };
      }
    });

    const tokens = await Promise.all(tokenBalancesToFetch);

    return tokens;
  } catch (error) {
    console.error(`error fetching tokens`, error);
    return [];
  }
};

// fetch token prices from alchemy
const fetchTokenPrices = async (tokens: Token[]) => {
  if (!tokens.length) return tokens;

  try {
    const addresses = tokens.map((token) => ({
      network:
        // price api only supports production chain. We will assume these and map testnet token address
        // to mainnet token address
        token.network === sepolia.name
          ? 'eth-mainnet'
          : token.network === zetachainAthensTestnet.name
          ? 'zetachain-mainnet'
          : 'eth-mainnet', // default to mainnet
      address:
        TestnetToMainnetTokenMap[
          token.address as keyof typeof TestnetToMainnetTokenMap
        ],
    }));

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
    console.error('error fetching token prices:', error);
    return tokens;
  }
};

export function useFetchTokens() {
  const { address, isConnected } = useAccount();
  const [tokens, setTokens] = useState<Token[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!isConnected || !address) {
      return;
    }

    const fetchAllTokens = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const allTokens: Token[] = [];

        const sepoliaTokens = await fetchNetworkTokens(address, sepolia.id);

        allTokens.push(...sepoliaTokens);

        const zetaTokens = await fetchNetworkTokens(
          address,
          zetachainAthensTestnet.id
        );

        allTokens.push(...zetaTokens);

        const { data: tokenPrices } = await fetchTokenPrices(allTokens);

        const allTokensWithPrices = allTokens.map((token, idx) => {
          // these are mainnet address so we cant use lookup by address to testnet,
          // using index as the order of fetch is constant
          return { ...token, priceInUsd: tokenPrices[idx]?.prices?.[0]?.value };
        });

        setTokens(allTokensWithPrices);
      } catch (e) {
        setError(e instanceof Error ? e : new Error('Unknown error occurred'));
        console.error('error fetching tokens:', e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllTokens();
  }, [address, isConnected]);

  const totalTokenValueInUsd = tokens.reduce((sum, token) => {
    if (token.priceInUsd && token.formattedBalance) {
      return sum + token.priceInUsd * parseFloat(token.formattedBalance);
    }
    return sum;
  }, 0);

  return {
    data: tokens,
    isLoading,
    error,
    totalTokenValueInUsd,
    refetch: () => {
      if (isConnected && address) {
        setIsLoading(true);
      }
    },
  };
}
