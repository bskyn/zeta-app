'use client';

import Image from 'next/image';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Logo from '../assets/logo.svg';
import { Button } from './ui/button';

const Header = () => {
  return (
    <header className="flex justify-between items-center py-4 px-6">
      <div className="flex items-center">
        <Image
          src={Logo}
          alt="Zeta App Logo"
          width={196}
          height={24}
          priority
        />
      </div>
      <div>
        <ConnectButton.Custom>
          {({
            account,
            chain,
            openAccountModal,
            openChainModal,
            openConnectModal,
            authenticationStatus,
            mounted,
          }) => {
            const ready = mounted && authenticationStatus !== 'loading';
            const connected =
              ready &&
              account &&
              chain &&
              (!authenticationStatus ||
                authenticationStatus === 'authenticated');

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
                {(() => {
                  if (!connected) {
                    return (
                      <Button
                        onClick={openConnectModal}
                        type="button"
                        className="rounded-none bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary-800 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                      >
                        Connect Wallet
                      </Button>
                    );
                  }

                  return (
                    <div className="flex items-center gap-3">
                      <Button
                        onClick={openChainModal}
                        type="button"
                        className="rounded-none flex items-center gap-1 bg-primary/10 px-3 py-2 text-sm font-medium text-primary"
                      >
                        {chain.name}
                      </Button>

                      <Button
                        onClick={openAccountModal}
                        type="button"
                        className="rounded-none bg-primary-foreground px-4 py-2 text-sm border-1 border-[#E5E8EC] font-medium text-primary hover:bg-primary-800"
                      >
                        {account.displayName}
                        {account.displayBalance
                          ? ` (${account.displayBalance})`
                          : ''}
                      </Button>
                    </div>
                  );
                })()}
              </div>
            );
          }}
        </ConnectButton.Custom>
      </div>
    </header>
  );
};

export default Header;
