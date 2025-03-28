'use client';

import { useAccount } from 'wagmi';
import Image from 'next/image';
import WalletIllustration from '../assets/wallet-illustration.svg';
import WalletIcon from '../assets/small-wallet-icon.svg';
import { Button } from '../components/ui/button';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useFetchTokens } from '@/hooks/useFetchTokens';
import { useFetchNativeTokens } from '@/hooks/useFetchNativeBalance';
import Footer from '@/components/Footer';
import TokenCard from '@/components/TokenCard';
import EmptyTokenCard from '@/components/EmptyTokenCard';

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
                          <div className="text-[#696E75] mb-3">
                            Connect your wallet to view your holdings.
                          </div>
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
          ) : (
            <>
              {nativeTokens &&
                nativeTokens.length > 0 &&
                nativeTokens.map((token) => (
                  <TokenCard
                    key={`native-${token.chainId}-${token.address}`}
                    token={token}
                  />
                ))}

              {tokens ? (
                tokens.map((token) => (
                  <TokenCard
                    key={`${token.chainId}-${token.address}`}
                    token={token}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-8 text-muted-foreground">
                  {isConnected
                    ? 'No tokens found in your wallet'
                    : 'Connect your wallet to view your tokens'}
                </div>
              )}
            </>
          )}
        </div>

        {!isConnected && <EmptyTokenCard />}
      </div>

      <Footer />
    </div>
  );
}
