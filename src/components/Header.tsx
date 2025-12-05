// Contribution #51: "^1.8.14", - Hashtag support
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";
import { useAppKit, useAppKitAccount } from "@reown/appkit/react";
import { ContractStatus } from "@/components/ContractStatus";

export default function Header() {
  const location = useLocation();
  const { open } = useAppKit();
  const { address, isConnected } = useAppKitAccount();

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/?sort=top", label: "Top" },
    { path: "/about", label: "About" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-primary/30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container mx-auto px-4 py-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="text-2xl font-bold glow-text">THE WALL</div>
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  location.pathname === link.path ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {isConnected ? (
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-primary">
                {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Connected'}
              </span>
              <Button
                onClick={() => open({ view: 'Account' })}
                size="sm"
                variant="outline"
                className="border-primary/30 text-primary hover:bg-primary/10"
              >
                <Wallet className="mr-2 h-4 w-4" />
                Account
              </Button>
            </div>
          ) : (
            <Button
              onClick={() => open({ view: 'Connect' })}
              size="sm"
              className="bg-primary text-primary-foreground hover:bg-primary/90 glow-hover"
            >
              <Wallet className="mr-2 h-4 w-4" />
              Connect Wallet
            </Button>
          )}
        </div>

        {/* Contract Status - Only show when connected */}
        {isConnected && (
          <div className="mt-3">
            <ContractStatus />
          </div>
        )}
      </div>
    </header>
  );
}
