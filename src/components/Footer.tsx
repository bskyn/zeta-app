import Image from 'next/image';
import Link from 'next/link';
import WalletIllustration from '../assets/wallet-illustration.svg';

const Footer = () => {
  return (
    <footer className="w-full border-t border-border mt-12">
      <div className="w-full max-w-6xl mx-auto p-6 flex flex-row justify-between items-center">
        <div className="flex items-center">
          <Image
            src={WalletIllustration}
            alt="Wallet Illustration"
            width={150}
            height={100}
            priority
          />
        </div>

        <div className="flex gap-4 text-sm">
          <Link
            href="https://www.zetachain.com"
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            ZetaChain
          </Link>
          <Link
            href="https://docs.zetachain.com"
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            Docs
          </Link>
          <Link
            href="https://explorer.zetachain.com"
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            Explorer
          </Link>
          <Link
            href="https://www.zetachain.com/blog"
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            Blog
          </Link>
          <Link
            href="#"
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            Terms
          </Link>
          <Link
            href="#"
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            Privacy
          </Link>
          <Link
            href="#"
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            Update
          </Link>
          <Link
            href="#"
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            Feedback
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
