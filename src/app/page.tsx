'use client';

import { useAccount } from 'wagmi';
import Image from 'next/image';
import WalletIllustration from '../assets/wallet-illustration.svg';
import WalletIcon from '../assets/small-wallet-icon.svg';
import { Button } from '../components/ui/button';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useFetchTokens } from '@/hooks/useFetchTokens';
import { Card, CardContent } from '../components/ui/card';
import { useFetchNativeTokens } from '@/hooks/useFetchNativeBalance';
import Footer from '@/components/Footer';

export default function HomePage() {
  const { isConnected } = useAccount();

  const {
    data: tokens,
    isLoading: isLoadingTokens,
    totalTokenValueInUsd,
  } = useFetchTokens();
  const {
    data: nativeTokens,
    isLoading: isLoadingNativeTokens,
    totalNativeValueInUsd,
  } = useFetchNativeTokens();

  const isLoading = isLoadingTokens || isLoadingNativeTokens;

  console.log('tokens', tokens);
  console.log('nativeTokens', nativeTokens);

  console.log('totalTokenValueInUsd', totalTokenValueInUsd);
  console.log('totalNativeValueInUsd', totalNativeValueInUsd);

  const totalBalanceInUsd = totalTokenValueInUsd + totalNativeValueInUsd;

  return (
    <div className="flex flex-col items-center">
      <div className="w-full max-w-6xl flex justify-between items-center p-6">
        <div className="flex flex-col">
          <span className="text-[32px] text-[#696E75]">Holdings</span>
          <span className="text-[80px] tracking-[-3px] font-medium">
            ${totalBalanceInUsd.toLocaleString()}
          </span>

          {!isConnected && (
            <div className="mt-4">
              <div className="flex flex-col gap-2">
                <ConnectButton.Custom>
                  {({ openConnectModal, mounted, authenticationStatus }) => {
                    const ready = mounted && authenticationStatus !== 'loading';

                    return (
                      <div
                        {...(!ready && {
                          style: {
                            opacity: 0,
                            pointerEvents: 'none',
                            userSelect: 'none',
                          },
                        })}
                      >
                        {ready && (
                          <label className="text-[#696E75] mb-2">
                            Connect your wallet to view your holdings.
                          </label>
                        )}
                        <Button
                          onClick={openConnectModal}
                          type="button"
                          className="rounded-none w-[172px] bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary-800 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 flex items-center gap-2"
                        >
                          <Image
                            src={WalletIcon}
                            alt="Wallet Icon"
                            width={16}
                            height={16}
                          />
                          Connect Wallet
                        </Button>
                      </div>
                    );
                  }}
                </ConnectButton.Custom>
              </div>
            </div>
          )}
        </div>

        <div>
          <Image
            src={WalletIllustration}
            alt="Wallet Illustration"
            width={300}
            height={200}
            priority
          />
        </div>
      </div>

      <div className="w-full border-t border-border"></div>

      <div className="w-full max-w-6xl p-6">
        <div className="flex flex-col gap-1 mb-4">
          <div className="text-xl font-semibold ">Tokens</div>
          <div className="text-sm ">
            ZetaChain compatible and ZRC-20 tokens across connected networks
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {isLoading ? (
            <div>Loading tokens...</div>
          ) : tokens ? (
            tokens.map((token) => (
              <Card
                key={`${token.chainId}-${token.address}`}
                className="overflow-hidden w-full h-full"
              >
                <CardContent className="flex flex-row md:flex-col items-center p-3 md:p-6 h-full">
                  <div className="mr-3 md:mr-0 md:mb-2 md:flex md:justify-center md:w-full">
                    {token.logo ? (
                      <Image
                        src={token.logo}
                        alt={token.symbol}
                        width={36}
                        height={36}
                        className="rounded-full md:w-12 md:h-12"
                      />
                    ) : (
                      <div className="w-9 h-9 md:w-12 md:h-12 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-500 text-xs md:text-sm">
                          NA
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-row md:flex-col flex-1 md:items-center">
                    <div className="flex flex-col md:items-center flex-1">
                      <div
                        className="text-xs break-words md:text-sm text-muted-foreground text-center md:mb-1 truncate max-w-full"
                        title={token.name}
                      >
                        {token.name}
                      </div>
                      <div
                        className="hidden md:block text-xs text-muted-foreground text-center mb-6 truncate max-w-full"
                        title={`Network: ${token.network}`}
                      >
                        Network: {token.network}
                      </div>
                    </div>

                    <div className="flex flex-col md:items-center">
                      <div
                        className="text-sm md:font-medium break-words text-center max-w-full"
                        title={`${token.formattedBalance || '0'} ${
                          token.symbol
                        }`}
                      >
                        <span className="md:hidden text-xs text-muted-foreground mr-1">
                          Balance:
                        </span>
                        {token.formattedBalance || '0'} {token.symbol}
                      </div>
                      <div className="text-xs md:text-sm text-muted-foreground truncate max-w-full">
                        {token.priceInUsd
                          ? `$${Number(token.priceInUsd).toLocaleString()}`
                          : '--'}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-8 text-muted-foreground">
              {isConnected
                ? 'No tokens found in your wallet'
                : 'Connect your wallet to view your tokens'}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
