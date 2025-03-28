'use client';

import { useAccount } from 'wagmi';
import Image from 'next/image';
import WalletIllustration from '../assets/wallet-illustration.svg';
import WalletIcon from '../assets/small-wallet-icon.svg';
import { Button } from '../components/ui/button';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function HomePage() {
  const { isConnected } = useAccount();

  return (
    <div className="flex flex-col items-center">
      <div className="w-full max-w-6xl flex justify-between items-center mb-12 p-6">
        <div className="flex flex-col">
          <span className="text-sm text-grey-500 mb-2">Holdings</span>
          <span className="text-3xl font-bold">$0.00</span>

          {!isConnected && (
            <div className="mt-4">
              <div className="flex flex-col gap-2">
                <label className="text-[#696E75]">
                  Connect your wallet to view your holdings.
                </label>
                <ConnectButton.Custom>
                  {({ openConnectModal }) => (
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
                  )}
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

      <div className="text-center max-w-3xl mx-auto mb-12"></div>
    </div>
  );
}
