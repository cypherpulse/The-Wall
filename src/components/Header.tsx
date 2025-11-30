// Contribution #51: "^1.8.14", - Hashtag support
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";
import { useAppKit } from "@reown/appkit/react";

export default function Header() {
  const location = useLocation();
  const { open } = useAppKit();

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/?sort=top", label: "Top" },
    { path: "/about", label: "About" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-primary/30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
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

        <Button 
          onClick={() => open()} 
          size="sm" 
          className="bg-primary text-primary-foreground hover:bg-primary/90 glow-hover"
        >
          <Wallet className="mr-2 h-4 w-4" />
          Connect Wallet
        </Button>
      </div>
    </header>
  );
}
