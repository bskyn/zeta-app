import WalletProvider from '@/components/WalletProvider';
import Header from '@/components/Header';
import './globals.css';

import localFont from 'next/font/local';

export const roobert = localFont({
  src: [
    {
      path: '../fonts/Roobert-Light.otf',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../fonts/Roobert-Regular.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../fonts/Roobert-Medium.otf',
      weight: '500',
      style: 'normal',
    },

    {
      path: '../fonts/Roobert-SemiBold.otf',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../fonts/Roobert-Bold.otf',
      weight: '700',
      style: 'normal',
    },
  ],
  display: 'swap',
  variable: '--font-roobert',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={roobert.variable}>
      <body className="min-h-screen">
        <WalletProvider>
          <div className="mx-auto max-w-[1440px] px-4">
            <Header />
            <main className="py-8">{children}</main>
          </div>
        </WalletProvider>
      </body>
    </html>
  );
}
