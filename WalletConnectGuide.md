# 🚀 WalletConnect Integration Guide with Reown AppKit

[![Reown AppKit](https://img.shields.io/badge/Reown_AppKit-v1.8.14-blue.svg)](https://docs.reown.com/appkit/overview)
[![Base Network](https://img.shields.io/badge/Network-Base-orange.svg)](https://base.org)
[![React](https://img.shields.io/badge/React-18+-61dafb.svg)](https://reactjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178c6.svg)](https://www.typescriptlang.org)

> **"Anonymous thoughts. Permanent records. Real connections."**
>
> Comprehensive integration guide for WalletConnect using Reown AppKit in "The Wall" - A decentralized social platform on Base blockchain.

---

## 📋 Table of Contents

- [🎯 Overview](#-overview)
- [📦 Prerequisites](#-prerequisites)
- [⚡ Quick Start](#-quick-start)
- [🔧 Installation](#-installation)
- [⚙️ Configuration](#️-configuration)
- [🧩 Component Integration](#-component-integration)
- [🎨 Customization](#-customization)
- [🔍 API Reference](#-api-reference)
- [🛠️ Troubleshooting](#️-troubleshooting)
- [📚 Best Practices](#-best-practices)
- [🧪 Testing](#-testing)
- [📖 Migration Guide](#-migration-guide)
- [🤝 Contributing](#-contributing)
- [📞 Support](#-support)
- [📜 License](#-license)

---

## 🎯 Overview

### What is Reown AppKit?

**Reown AppKit** is the next-generation Web3 modal solution that revolutionizes wallet connectivity. Built by the creators of WalletConnect, it provides:

<div align="center">

| Feature | Description |
|---------|-------------|
| 🔗 **Multi-Wallet Support** | MetaMask, WalletConnect, Coinbase Wallet, Trust Wallet, and 300+ more |
| 🌐 **Multi-Network** | Seamless switching between Ethereum, Base, Arbitrum, Polygon, Optimism |
| 📱 **Inline Modals** | No page redirects - modals open directly in your application |
| ⚛️ **React Native** | First-class React support with hooks and TypeScript |
| 🎨 **Themeable** | Fully customizable appearance with CSS variables |
| 📊 **Analytics** | Built-in analytics and user behavior insights |

</div>

### Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Your App      │────│  Reown AppKit   │────│   Wallets       │
│   (React)       │    │   Modal         │    │   (MetaMask,    │
└─────────────────┘    └─────────────────┘    │   Coinbase, etc)│
                                              └─────────────────┘
                                                     │
                                              ┌─────────────────┐
                                              │   Blockchains    │
                                              │   (Base, ETH,    │
                                              │    Arbitrum)     │
                                              └─────────────────┘
```

### Key Benefits

- ✅ **Zero Configuration**: Works out-of-the-box with sensible defaults
- ✅ **Type Safe**: Full TypeScript support with auto-completion
- ✅ **Secure**: Built with security best practices
- ✅ **Performant**: Optimized for mobile and desktop
- ✅ **Accessible**: WCAG compliant and screen reader friendly

---

## 📦 Prerequisites

Before diving into the integration, ensure your development environment meets these requirements:

### System Requirements

- **Node.js**: `>=18.0.0`
- **npm**: `>=8.0.0` or **pnpm**: `>=7.0.0`
- **React**: `>=18.0.0`
- **TypeScript**: `>=5.0.0` (recommended)

### Development Tools

```bash
# Check versions
node --version    # Should be >= 18.0.0
npm --version     # Should be >= 8.0.0
```

### Reown Cloud Account

1. Visit [dashboard.reown.com](https://dashboard.reown.com)
2. Create a new project
3. Copy your **Project ID** (keep it secure!)

### Knowledge Prerequisites

- Basic understanding of React and TypeScript
- Familiarity with Web3 concepts (wallets, networks, transactions)
- Experience with modern JavaScript tooling (Vite, ES modules)

---

## ⚡ Quick Start

Get WalletConnect working in under 5 minutes:

### 1. Install Dependencies

```bash
npm install @reown/appkit @reown/appkit-adapter-wagmi wagmi viem @tanstack/react-query
```

### 2. Create Environment File

```bash
# .env
VITE_PROJECT_ID=your_reown_project_id_here
```

### 3. Configure AppKit

```tsx
// src/config/appkit.tsx
import { createAppKit } from '@reown/appkit/react'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { base } from '@reown/appkit/networks'

const projectId = import.meta.env.VITE_PROJECT_ID

createAppKit({
  adapters: [new WagmiAdapter({ networks: [base], projectId })],
  networks: [base],
  projectId,
  metadata: {
    name: 'THE WALL',
    description: 'Anonymous thoughts. Permanent records. Real connections.',
    url: window.location.origin,
    icons: ['https://avatars.githubusercontent.com/u/179229932']
  }
})
```

### 4. Wrap Your App

```tsx
// src/main.tsx
import { AppKitProvider } from './config/appkit'

createRoot(document.getElementById('root')!).render(
  <AppKitProvider>
    <App />
  </AppKitProvider>
)
```

### 5. Add Connect Button

```tsx
// src/components/Header.tsx
import { useAppKit, useAppKitAccount } from '@reown/appkit/react'

export function Header() {
  const { open } = useAppKit()
  const { isConnected, address } = useAppKitAccount()

  return (
    <button onClick={() => open()}>
      {isConnected ? `Connected: ${address?.slice(0, 6)}...` : 'Connect Wallet'}
    </button>
  )
}
```

🎉 **That's it!** Your app now has full WalletConnect functionality.

---

## 🔧 Installation

### Core Dependencies

Install the essential packages for Reown AppKit integration:

```bash
# Using npm
npm install @reown/appkit @reown/appkit-adapter-wagmi wagmi viem @tanstack/react-query

# Using pnpm
pnpm add @reown/appkit @reown/appkit-adapter-wagmi wagmi viem @tanstack/react-query

# Using yarn
yarn add @reown/appkit @reown/appkit-adapter-wagmi wagmi viem @tanstack/react-query
```

### Optional Dependencies

For enhanced functionality, consider installing:

```bash
# For additional network support
npm install @reown/appkit/networks

# For better React integration
npm install @types/react @types/react-dom
```

### Version Compatibility

| Package | Version | Purpose |
|---------|---------|---------|
| `@reown/appkit` | `^1.8.14` | Core modal functionality |
| `@reown/appkit-adapter-wagmi` | `^1.8.14` | Wagmi integration |
| `wagmi` | `^3.0.2` | React Ethereum hooks |
| `viem` | `^2.40.3` | TypeScript Ethereum library |
| `@tanstack/react-query` | `^5.0.0` | Data fetching and caching |

---

## ⚙️ Configuration

### Environment Setup

Create a secure environment configuration:

```bash
# .env (add to .gitignore)
VITE_PROJECT_ID=1234567890abcdef1234567890abcdef
```

### AppKit Configuration

Here's the complete configuration for "The Wall":

```tsx
// src/config/appkit.tsx
import { createAppKit } from '@reown/appkit/react'
import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { base, mainnet, arbitrum, type AppKitNetwork } from '@reown/appkit/networks'
import type { ReactNode } from 'react'

// 1. Setup React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 2,
    },
  },
})

// 2. Get project ID from environment
const projectId = import.meta.env.VITE_PROJECT_ID

if (!projectId) {
  throw new Error('VITE_PROJECT_ID is required. Get one at https://dashboard.reown.com')
}

// 3. Application metadata
const metadata = {
  name: 'THE WALL',
  description: 'Anonymous thoughts. Permanent records. Real connections.',
  url: typeof window !== 'undefined' ? window.location.origin : 'https://the-wall.vercel.app',
  icons: ['https://avatars.githubusercontent.com/u/179229932'],
  redirect: {
    native: 'thewall://',
    universal: 'https://the-wall.vercel.app'
  }
}

// 4. Supported networks (Base as primary)
const networks: [AppKitNetwork, ...AppKitNetwork[]] = [
  base,      // Primary: Base Network
  mainnet,   // Ethereum Mainnet
  arbitrum,  // Arbitrum One
]

// 5. Create Wagmi adapter
const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId,
  ssr: false, // Disable SSR for client-side only
})

// 6. Create AppKit modal
createAppKit({
  adapters: [wagmiAdapter],
  networks,
  projectId,
  metadata,
  features: {
    analytics: true,        // Enable usage analytics
    email: false,          // Disable email notifications
    socials: [],           // No social logins for privacy
  },
  themeMode: 'light',
  themeVariables: {
    '--apkt-accent': '#000000',           // Black accent for THE WALL theme
    '--apkt-color-mix': '#ffffff',        // White background mix
    '--apkt-color-mix-strength': 0,       // No color mixing
    '--apkt-border-radius-master': '8px', // Rounded corners
  },
  enableWalletConnect: true,
  enableInjected: true,
  enableCoinbase: true,
})

// 7. Provider component
export function AppKitProvider({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  )
}
```

### Application Entry Point

Update your main application file:

```tsx
// src/main.tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AppKitProvider } from './config/appkit'
import App from './App'
import './index.css'

const container = document.getElementById('root')

if (!container) {
  throw new Error('Root element not found')
}

const root = createRoot(container)

root.render(
  <StrictMode>
    <AppKitProvider>
      <App />
    </AppKitProvider>
  </StrictMode>
)
```

### App Component Cleanup

Ensure your App component doesn't duplicate providers:

```tsx
// src/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'

// Pages
import Index from './pages/Index'
import PostDetail from './pages/PostDetail'
import About from './pages/About'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/post/:id" element={<PostDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  )
}
```

---

## 🧩 Component Integration

### Connect Button Component

Create a reusable wallet connection component:

```tsx
// src/components/WalletConnect.tsx
import { useAppKit, useAppKitAccount, useAppKitNetwork } from '@reown/appkit/react'
import { Button } from '@/components/ui/button'
import { Wallet, ChevronDown, ExternalLink } from 'lucide-react'
import { useState } from 'react'

export function WalletConnect() {
  const { open } = useAppKit()
  const { address, isConnected, status } = useAppKitAccount()
  const { chainId } = useAppKitNetwork()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  const getNetworkName = (chainId: number) => {
    const networks: Record<number, string> = {
      1: 'Ethereum',
      8453: 'Base',
      42161: 'Arbitrum',
    }
    return networks[chainId] || 'Unknown'
  }

  if (status === 'connecting') {
    return (
      <Button disabled size="sm" className="animate-pulse">
        <Wallet className="mr-2 h-4 w-4" />
        Connecting...
      </Button>
    )
  }

  if (!isConnected) {
    return (
      <Button
        onClick={() => open({ view: 'Connect' })}
        size="sm"
        className="bg-primary text-primary-foreground hover:bg-primary/90"
      >
        <Wallet className="mr-2 h-4 w-4" />
        Connect Wallet
      </Button>
    )
  }

  return (
    <div className="relative">
      <Button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        size="sm"
        variant="outline"
        className="flex items-center space-x-2"
      >
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="font-medium">{formatAddress(address!)}</span>
          <span className="text-xs text-muted-foreground">
            {getNetworkName(chainId)}
          </span>
        </div>
        <ChevronDown className="h-4 w-4" />
      </Button>

      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-background border border-border rounded-md shadow-lg z-50">
          <div className="p-2">
            <button
              onClick={() => {
                open({ view: 'Account' })
                setIsDropdownOpen(false)
              }}
              className="w-full flex items-center space-x-2 px-3 py-2 text-sm hover:bg-accent rounded"
            >
              <Wallet className="h-4 w-4" />
              <span>Account Details</span>
            </button>

            <button
              onClick={() => {
                open({ view: 'Networks' })
                setIsDropdownOpen(false)
              }}
              className="w-full flex items-center space-x-2 px-3 py-2 text-sm hover:bg-accent rounded"
            >
              <ExternalLink className="h-4 w-4" />
              <span>Switch Network</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
```

### Header Integration

Integrate the wallet component into your header:

```tsx
// src/components/Header.tsx
import { Link, useLocation } from 'react-router-dom'
import { WalletConnect } from './WalletConnect'

export default function Header() {
  const location = useLocation()

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/?sort=top', label: 'Top' },
    { path: '/about', label: 'About' },
  ]

  return (
    <header className="sticky top-0 z-50 border-b border-primary/30 bg-background/95 backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center space-x-2">
          <div className="text-2xl font-bold glow-text">THE WALL</div>
        </Link>

        <nav className="hidden md:flex items-center space-x-6">
          {navLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                location.pathname === link.path ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <WalletConnect />
      </div>
    </header>
  )
}
```

---

## 🎨 Customization

### Theme Configuration

Customize the modal appearance to match your brand:

```tsx
// Dark theme example
createAppKit({
  // ... other config
  themeMode: 'dark',
  themeVariables: {
    '--apkt-accent': '#00ff88',           // Neon green accent
    '--apkt-color-mix': '#1a1a1a',        // Dark background
    '--apkt-color-mix-strength': 100,    // Full color mixing
    '--apkt-font-family': '"JetBrains Mono", monospace',
    '--apkt-border-radius-master': '12px',
  }
})
```

### Custom CSS Variables

Override default styles with CSS:

```css
/* src/index.css */
:root {
  --apkt-accent: #000000;
  --apkt-color-mix: #ffffff;
  --apkt-color-mix-strength: 0;
  --apkt-font-family: 'Inter', sans-serif;
  --apkt-border-radius-master: 8px;
}

/* Dark mode overrides */
@media (prefers-color-scheme: dark) {
  :root {
    --apkt-color-mix: #0a0a0a;
    --apkt-accent: #ffffff;
  }
}
```

### Custom Modal Views

Create custom modal experiences:

```tsx
// Custom connect view
open({
  view: 'Connect',
  namespace: 'eip155',
  requestedChains: [8453], // Base network only
})

// Custom account view with specific sections
open({
  view: 'Account',
  namespace: 'eip155',
  showBalance: true,
  showTransactions: true,
})
```

---

## 🔍 API Reference

### useAppKit Hook

```tsx
const {
  open,           // (options?: OpenOptions) => void
  close,          // () => void
  isOpen,         // boolean
  setThemeMode,   // (mode: 'light' | 'dark' | 'system') => void
} = useAppKit()
```

**OpenOptions:**
```typescript
type OpenOptions = {
  view?: 'Connect' | 'Account' | 'Networks' | 'WhatIsAWallet'
  namespace?: string
  requestedChains?: number[]
  showBalance?: boolean
  showTransactions?: boolean
}
```

### useAppKitAccount Hook

```tsx
const {
  address,        // `0x${string}` | undefined
  isConnected,    // boolean
  caipAddress,    // string | undefined
  status,         // 'connecting' | 'connected' | 'disconnected' | 'reconnecting'
  addresses,      // readonly `0x${string}`[] | undefined
} = useAppKitAccount()
```

### useAppKitNetwork Hook

```tsx
const {
  chainId,        // number | undefined
  caipNetworkId,  // string | undefined
  switchNetwork,  // (network: AppKitNetwork) => Promise<void>
  networks,       // readonly AppKitNetwork[]
} = useAppKitNetwork()
```

### useAppKitTheme Hook

```tsx
const {
  themeMode,      // 'light' | 'dark' | 'system'
  themeVariables, // Record<string, string>
  setThemeMode,   // (mode: 'light' | 'dark' | 'system') => void
  setThemeVariables, // (variables: Record<string, string>) => void
} = useAppKitTheme()
```

---

## 🛠️ Troubleshooting

### 🔴 Modal Opens as White Page

**Problem:** Modal redirects to a blank page instead of opening inline.

**Solutions:**
1. **Check theme variables:**
   ```tsx
   themeVariables: {
     '--apkt-accent': '#000000',
     '--apkt-color-mix': '#ffffff',
     '--apkt-color-mix-strength': 0
   }
   ```

2. **Verify theme mode:**
   ```tsx
   themeMode: 'light' // or 'dark'
   ```

3. **Clear browser cache and localStorage**

4. **Check project ID validity**

### 🔴 Wallet Address Not Showing

**Problem:** Connected but no address displayed.

**Solutions:**
1. **Import correct hooks:**
   ```tsx
   import { useAppKit, useAppKitAccount } from '@reown/appkit/react'
   ```

2. **Check connection state:**
   ```tsx
   const { address, isConnected } = useAppKitAccount()
   if (isConnected && address) {
     // Show address
   }
   ```

3. **Handle undefined address:**
   ```tsx
   {address ? formatAddress(address) : 'Connected'}
   ```

### 🔴 Network Switching Fails

**Problem:** Cannot switch to certain networks.

**Solutions:**
1. **Verify network support:**
   ```tsx
   const networks = [base, mainnet, arbitrum] // Include target network
   ```

2. **Check wallet compatibility:** Some wallets don't support all networks

3. **Update wallet app:** Ensure wallet is updated to latest version

### 🔴 Build Errors

**Common Issues:**

1. **Missing peer dependencies:**
   ```bash
   npm install @types/react @types/react-dom
   ```

2. **TypeScript errors:**
   ```json
   // tsconfig.json
   {
     "compilerOptions": {
       "types": ["@reown/appkit"]
     }
   }
   ```

3. **Vite environment variables:**
   ```typescript
   // vite.config.ts
   define: {
     'import.meta.env.VITE_PROJECT_ID': JSON.stringify(process.env.VITE_PROJECT_ID)
   }
   ```

### 🔴 Performance Issues

**Optimizations:**
1. **Memoize hook values:**
   ```tsx
   const address = useMemo(() => account.address, [account.address])
   ```

2. **Debounce rapid calls:**
   ```tsx
   const debouncedOpen = useCallback(debounce(open, 300), [open])
   ```

3. **Lazy load modal:**
   ```tsx
   const { open } = useAppKit()
   // Only load when needed
   ```

---

## 📚 Best Practices

### 🔒 Security

- **Never commit project ID:** Use environment variables
- **Validate inputs:** Sanitize all user inputs
- **Use HTTPS:** Always serve over secure connection
- **Audit dependencies:** Regularly update and audit packages

### ⚡ Performance

- **Initialize once:** Create AppKit instance at app level
- **Memoize components:** Use React.memo for wallet components
- **Lazy loading:** Load wallet logic only when needed
- **Optimize re-renders:** Use useMemo for expensive operations

### 🎨 User Experience

- **Clear states:** Show loading, connected, and error states
- **Progressive enhancement:** App works without JavaScript
- **Accessibility:** Support keyboard navigation and screen readers
- **Error handling:** Provide helpful error messages

### 🧪 Testing

- **Mock connections:** Test with mock wallet connections
- **Multiple wallets:** Test with different wallet types
- **Network switching:** Verify network change functionality
- **Error scenarios:** Test disconnection and error states

---

## 🧪 Testing

### Unit Tests

```tsx
// src/components/__tests__/WalletConnect.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { WalletConnect } from '../WalletConnect'

// Mock the hooks
jest.mock('@reown/appkit/react', () => ({
  useAppKit: () => ({ open: jest.fn() }),
  useAppKitAccount: () => ({
    address: '0x1234567890abcdef',
    isConnected: true,
    status: 'connected'
  }),
  useAppKitNetwork: () => ({ chainId: 8453 })
}))

describe('WalletConnect', () => {
  it('shows connected address', () => {
    render(<WalletConnect />)
    expect(screen.getByText('0x1234...cdef')).toBeInTheDocument()
  })
})
```

### Integration Tests

```tsx
// src/__tests__/appkit-integration.test.tsx
import { render, waitFor } from '@testing-library/react'
import { AppKitProvider } from '../config/appkit'
import App from '../App'

describe('AppKit Integration', () => {
  it('renders without crashing', async () => {
    render(
      <AppKitProvider>
        <App />
      </AppKitProvider>
    )

    await waitFor(() => {
      expect(screen.getByText('THE WALL')).toBeInTheDocument()
    })
  })
})
```

### E2E Tests

```typescript
// e2e/wallet-connect.spec.ts
import { test, expect } from '@playwright/test'

test('wallet connection flow', async ({ page }) => {
  await page.goto('/')

  // Click connect button
  await page.click('text=Connect Wallet')

  // Modal should open (not redirect)
  await expect(page.locator('[data-testid="appkit-modal"]')).toBeVisible()

  // Simulate wallet connection
  // ... wallet interaction steps

  // Verify connected state
  await expect(page.locator('text=0x1234...cdef')).toBeVisible()
})
```

---

## 📖 Migration Guide

### From Web3Modal v3

**Breaking Changes:**

1. **Import paths:**
   ```tsx
   // Old
   import { Web3Modal } from '@web3modal/wagmi'

   // New
   import { createAppKit } from '@reown/appkit/react'
   ```

2. **Hook names:**
   ```tsx
   // Old
   const { open } = useWeb3Modal()

   // New
   const { open } = useAppKit()
   ```

3. **Configuration:**
   ```tsx
   // Old
   const modal = new Web3Modal({ ... })

   // New
   createAppKit({ ... })
   ```

4. **Theme variables:**
   ```tsx
   // Old
   '--w3m-accent': '#000'

   // New
   '--apkt-accent': '#000'
   ```

### From Web3Modal v2

**Major Changes:**
- Complete rewrite with new API
- Better TypeScript support
- Improved performance
- Enhanced customization options

### Migration Steps

1. **Update dependencies:**
   ```bash
   npm uninstall @web3modal/wagmi
   npm install @reown/appkit @reown/appkit-adapter-wagmi
   ```

2. **Update imports and hooks**

3. **Migrate configuration**

4. **Update theme variables**

5. **Test thoroughly**

---

## 🤝 Contributing

We welcome contributions to improve this integration guide!

### Development Setup

```bash
# Fork and clone
git clone https://github.com/your-username/The-Wall.git
cd The-Wall

# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test
```

### Guidelines

- **Documentation:** Update this guide when making changes
- **Code Style:** Follow existing TypeScript and React patterns
- **Testing:** Add tests for new features
- **Commits:** Use conventional commit messages

### Areas for Contribution

- [ ] Additional wallet integrations
- [ ] Multi-chain support examples
- [ ] Advanced customization guides
- [ ] Performance optimization tips
- [ ] Accessibility improvements

---

## 📞 Support

### Community Resources

- 📖 **[Reown Documentation](https://docs.reown.com)** - Official docs
- 💬 **[Discord Community](https://discord.gg/reown)** - Get help from community
- 🐛 **[GitHub Issues](https://github.com/reown-com/appkit/issues)** - Report bugs
- 📧 **[Email Support](mailto:support@reown.com)** - Direct support

### Project-Specific Help

For issues specific to "The Wall":

1. Check this documentation first
2. Review the implementation in `src/config/appkit.tsx`
3. Test with the provided examples
4. Check browser console for errors

### Common Questions

**Q: Why does the modal redirect instead of opening inline?**
A: Ensure theme variables are properly configured. See troubleshooting section.

**Q: How do I add support for more networks?**
A: Add networks to the `networks` array in `appkit.tsx` configuration.

**Q: Can I customize the modal appearance?**
A: Yes, use `themeVariables` and CSS custom properties.

---

## 📜 License

This integration guide is part of "The Wall" project and follows the same license terms.

---

<div align="center">

**Built with ❤️ using Reown AppKit**

[⭐ Star us on GitHub](https://github.com/cypherpulse/The-Wall) • [📖 Read the docs](https://docs.reown.com) • [🚀 Deploy on Base](https://base.org)

</div>