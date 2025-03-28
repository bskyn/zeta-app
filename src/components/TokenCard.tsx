import { Token } from '@/interfaces';
import Image from 'next/image';
import { Card, CardContent } from '../components/ui/card';

const TokenCard = ({ token }: { token: Token }) => {
  return (
    <Card className="overflow-hidden w-full h-full">
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
                {token.symbol?.substring(0, 2) || 'NA'}
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-row md:flex-col flex-1 md:items-center">
          <div className="flex flex-col md:text-center flex-1">
            <div
              className="text-xs break-words md:text-sm text-muted-foreground md:mb-1 truncate max-w-full text-left md:text-center"
              title={token.name}
            >
              {token.name}
            </div>
            <div
              className="hidden md:block text-xs text-muted-foreground mb-6 truncate max-w-full text-left md:text-center"
              title={`Network: ${token.network}`}
            >
              Network: {token.network}
            </div>
          </div>

          <div className="flex flex-col md:items-center">
            <div
              className="text-sm md:font-medium break-words text-right md:text-center max-w-full"
              title={`${token.formattedBalance || '0'} ${token.symbol}`}
            >
              <span className="md:hidden text-xs text-muted-foreground mr-1">
                Balance:
              </span>
              {token.formattedBalance || '0'} {token.symbol}
            </div>
            <div className="text-xs md:text-sm text-muted-foreground truncate max-w-full text-right md:text-center">
              {token.priceInUsd
                ? `$${Number(token.priceInUsd).toLocaleString()}`
                : '$0'}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TokenCard;
