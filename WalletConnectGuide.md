# WalletConnect Integration Guide with Reown AppKit

## Overview

This guide provides comprehensive documentation on integrating WalletConnect with Reown AppKit in "The Wall" - a decentralized social platform built on the Base blockchain. The integration enables seamless wallet connections, allowing users to interact with the dApp using their preferred Web3 wallets.

## What is Reown AppKit?

Reown AppKit is a comprehensive Web3 modal solution that provides:
- **Multi-wallet support**: Connect with MetaMask, WalletConnect, Coinbase Wallet, and more
- **Network switching**: Easy switching between Ethereum, Base, Arbitrum, and other networks
- **Inline modals**: No page redirects - modals open directly in your app
- **React integration**: Built specifically for React applications with hooks and components
- **TypeScript support**: Full type safety for better development experience

## Prerequisites

Before integrating Reown AppKit, ensure you have:

- Node.js 18+ and npm/pnpm
- A Reown Cloud project ID (get one at [dashboard.reown.com](https://dashboard.reown.com))
- Basic understanding of React and TypeScript
- Familiarity with Wagmi and Viem libraries

## Installation

Install the required packages for Reown AppKit integration:

```bash
npm install @reown/appkit @reown/appkit-adapter-wagmi wagmi viem @tanstack/react-query
```

Or using pnpm:

```bash
pnpm add @reown/appkit @reown/appkit-adapter-wagmi wagmi viem @tanstack/react-query
```

## Project Setup

### 1. Environment Variables

Create a `.env` file in your project root and add your Reown project ID:

```env
VITE_PROJECT_ID=your_reown_project_id_here
```

**Important**: Add `.env` to your `.gitignore` file to keep your project ID secure.

### 2. AppKit Configuration

Create `src/config/appkit.tsx` with the following configuration:

```tsx
import { createAppKit } from '@reown/appkit/react'
import { WagmiProvider } from 'wagmi'
import { mainnet, arbitrum, base, type AppKitNetwork } from '@reown/appkit/networks'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { ReactNode } from 'react'

// 0. Setup queryClient
const queryClient = new QueryClient()

// 1. Get projectId from https://dashboard.reown.com
const projectId = import.meta.env.VITE_PROJECT_ID

// 2. Create a metadata object
const metadata = {
  name: 'THE WALL',
  description: 'Anonymous thoughts. Permanent records. Real connections.',
  url: typeof window !== 'undefined' ? window.location.origin : 'https://example.com',
  icons: ['https://avatars.githubusercontent.com/u/179229932']
}

// 3. Set the networks - include Base as the primary network
const networks: [AppKitNetwork, ...AppKitNetwork[]] = [base, mainnet, arbitrum]

// 4. Create Wagmi Adapter
const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId,
  ssr: false
})

// 5. Create modal
createAppKit({
  adapters: [wagmiAdapter],
  networks,
  projectId,
  metadata,
  features: {
    analytics: true
  },
  themeMode: 'light',
  themeVariables: {
    '--apkt-accent': '#000000',
    '--apkt-color-mix': '#ffffff',
    '--apkt-color-mix-strength': 0
  }
})

export function AppKitProvider({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  )
}
```

### 3. App Entry Point

Update `src/main.tsx` to wrap your app with the AppKitProvider:

```tsx
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { AppKitProvider } from "./config/appkit.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <AppKitProvider>
    <App />
  </AppKitProvider>
);
```

### 4. Remove Provider from App Component

Ensure your `src/App.tsx` doesn't duplicate the provider wrapping. The AppKitProvider should only be in main.tsx:

```tsx
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import PostDetail from "./pages/PostDetail";
import About from "./pages/About";
import NotFound from "./pages/NotFound";

const App = () => (
  <TooltipProvider>
    <Toaster />
    <Sonner />
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/post/:id" element={<PostDetail />} />
        <Route path="/about" element={<About />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </TooltipProvider>
);

export default App;
```

## Component Integration

### Basic Connect Button

Create a simple connect button in your Header component:

```tsx
import { useAppKit, useAppKitAccount } from "@reown/appkit/react";
import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";

export default function Header() {
  const { open } = useAppKit();
  const { address, isConnected } = useAppKitAccount();

  return (
    <header>
      {/* ... other header content ... */}
      
      {isConnected ? (
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-primary">
            {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Connected'}
          </span>
          <Button 
            onClick={() => open({ view: 'Account' })} 
            size="sm" 
            variant="outline"
          >
            <Wallet className="mr-2 h-4 w-4" />
            Account
          </Button>
        </div>
      ) : (
        <Button 
          onClick={() => open({ view: 'Connect' })} 
          size="sm"
        >
          <Wallet className="mr-2 h-4 w-4" />
          Connect Wallet
        </Button>
      )}
    </header>
  );
}
```

## Key Features and Hooks

### useAppKit Hook

The `useAppKit` hook provides methods to control the modal:

```tsx
const { open, close, isOpen } = useAppKit();

// Open connect modal
open({ view: 'Connect' });

// Open account modal
open({ view: 'Account' });

// Open network selector
open({ view: 'Networks' });

// Close modal
close();
```

### useAppKitAccount Hook

The `useAppKitAccount` hook provides account information:

```tsx
const { 
  address,        // Connected wallet address
  isConnected,    // Connection status
  caipAddress,    // CAIP-10 compliant address
  status          // Connection status ('connecting' | 'connected' | 'disconnected' | 'reconnecting')
} = useAppKitAccount();
```

### useAppKitNetwork Hook

For network information and switching:

```tsx
const { 
  chainId,        // Current chain ID
  caipNetworkId,  // CAIP-2 compliant network ID
  switchNetwork   // Function to switch networks
} = useAppKitNetwork();

// Switch to Base network
switchNetwork(base);
```

## Configuration Options

### Networks

Configure supported networks in your appkit.tsx:

```tsx
import { mainnet, arbitrum, base, polygon, optimism } from '@reown/appkit/networks'

const networks: [AppKitNetwork, ...AppKitNetwork[]] = [
  base,      // Primary network
  mainnet,   // Ethereum mainnet
  arbitrum,  // Arbitrum
  polygon,   // Polygon
  optimism   // Optimism
]
```

### Theme Customization

Customize the modal appearance:

```tsx
createAppKit({
  // ... other config
  themeMode: 'light', // 'light' | 'dark' | 'system'
  themeVariables: {
    '--apkt-accent': '#000000',           // Primary accent color
    '--apkt-color-mix': '#ffffff',        // Background color mix
    '--apkt-color-mix-strength': 0,       // Mix strength (0-100)
    '--apkt-border-radius-master': '8px'  // Border radius
  }
})
```

### Features

Enable/disable specific features:

```tsx
createAppKit({
  // ... other config
  features: {
    analytics: true,        // Enable analytics
    email: false,          // Disable email notifications
    socials: ['google', 'github'], // Enable specific social logins
    history: true          // Enable transaction history
  }
})
```

## Troubleshooting

### Modal Not Opening Inline

If the modal redirects to a white page instead of opening inline:

1. **Check theme variables**: Ensure `themeVariables` are properly set in `createAppKit`
2. **Verify theme mode**: Set `themeMode` to 'light' or 'dark'
3. **Clear cache**: Clear browser cache and local storage
4. **Check project ID**: Ensure VITE_PROJECT_ID is correctly set

### Address Not Displaying

If the wallet address doesn't show when connected:

1. **Import hooks**: Ensure both `useAppKit` and `useAppKitAccount` are imported
2. **Check connection state**: Use `isConnected` to conditionally render address
3. **Address formatting**: Handle cases where address might be undefined

### Network Switching Issues

If network switching doesn't work:

1. **Network configuration**: Ensure the target network is included in the `networks` array
2. **Primary network**: Make sure Base is the first network in the array
3. **Wallet support**: Some wallets may not support certain networks

### Build Errors

Common build issues:

1. **Missing dependencies**: Ensure all Reown packages are installed with correct versions
2. **TypeScript errors**: Check that you're using compatible TypeScript versions
3. **Vite configuration**: Ensure Vite is configured to handle the environment variables

## Best Practices

### Security

- Never commit your Reown project ID to version control
- Use environment variables for sensitive configuration
- Validate all user inputs before sending transactions

### Performance

- Initialize AppKit once at the app level
- Use React.memo for components using wallet hooks
- Avoid unnecessary re-renders by memoizing hook values

### User Experience

- Always show connection status clearly
- Provide fallback UI for disconnected states
- Handle loading states during wallet operations
- Display user-friendly error messages

### Testing

- Test with multiple wallet types (MetaMask, WalletConnect, Coinbase)
- Verify network switching functionality
- Test on different devices and browsers
- Mock wallet connections for unit tests

## Migration from Web3Modal v3

If migrating from Web3Modal v3 to Reown AppKit:

1. **Update imports**: Change from `@web3modal/wagmi` to `@reown/appkit`
2. **Update hook names**: `useWeb3Modal` becomes `useAppKit`
3. **Update configuration**: Use `createAppKit` instead of `createWeb3Modal`
4. **Update theme variables**: CSS variable names changed (e.g., `--w3m-` to `--apkt-`)

## Resources

- [Reown AppKit Documentation](https://docs.reown.com/appkit/overview)
- [Reown Cloud Dashboard](https://dashboard.reown.com)
- [Wagmi Documentation](https://wagmi.sh)
- [Viem Documentation](https://viem.sh)

## Support

For issues specific to this project:
1. Check the troubleshooting section above
2. Review the implementation in `src/config/appkit.tsx`
3. Test with the Header component integration
4. Check browser console for error messages

For general Reown AppKit support:
- [GitHub Issues](https://github.com/reown-com/appkit/issues)
- [Discord Community](https://discord.gg/reown)
- [Documentation](https://docs.reown.com)</content>
<parameter name="filePath">g:\2025\Learning\Blockchain\WalletConnectors\neon-wall-main\WalletConnectGuide.md