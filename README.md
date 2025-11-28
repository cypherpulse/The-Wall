# The Wall

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Base Network](https://img.shields.io/badge/Base-0052FF?logo=ethereum&logoColor=white)](https://base.org/)
[![Decentralized](https://img.shields.io/badge/Decentralized-FF6B35?logo=ethereum&logoColor=white)](https://ethereum.org/)
[![Reown AppKit](https://img.shields.io/badge/Reown_AppKit-1.8.14-4A90E2?logo=walletconnect&logoColor=white)](https://docs.reown.com/appkit)
[![Reown AppKit Adapter Wagmi](https://img.shields.io/badge/Reown_AppKit_Adapter_Wagmi-1.8.14-00D4AA?logo=ethereum&logoColor=white)](https://docs.reown.com/appkit)
[![Viem](https://img.shields.io/badge/Viem-2.40.3-FF6B35?logo=ethereum&logoColor=white)](https://viem.sh/)
[![Wagmi](https://img.shields.io/badge/Wagmi-3.0.2-FF6B35?logo=ethereum&logoColor=white)](https://wagmi.sh/)

> Anonymous thoughts. Permanent records. Real connections. Built on Base Network.

The Wall is a fully **decentralized** social platform built on the **Base blockchain network**, allowing users to share thoughts and engage in anonymous conversations permanently stored on-chain. Powered by WalletConnect for seamless wallet integration and smart contract backend for data persistence.

## 🌟 Features

- **Anonymous Posting**: Share thoughts without revealing your identity
- **Decentralized Architecture**: All data stored on Base blockchain for permanence and censorship resistance
- **Smart Contract Backend**: On-chain data storage and interactions
- **Wallet Integration**: Connect with WalletConnect using Reown AppKit
- **Real-time Interactions**: Reply to posts and build connections
- **Modern UI**: Built with ShadCN UI components and Tailwind CSS
- **Type-Safe**: Full TypeScript support for reliable development

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI library
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **ShadCN UI** - Accessible component library

### Blockchain & Wallets
- **Base Network** - Ethereum Layer 2 for fast, low-cost transactions
- **Reown AppKit v1.8.14** - Wallet connection library
- **Reown AppKit Adapter Wagmi v1.8.14** - Wagmi adapter for AppKit
- **Wagmi v3.0.2** - React hooks for Ethereum
- **Viem v2.40.3** - TypeScript interface for Ethereum

### Backend (Smart Contracts)
- **Solidity** - Smart contract language
- **Hardhat/Ethers.js** - Development and deployment tools
- **IPFS** - Decentralized file storage (if applicable)

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **React Router** - Client-side routing
- **React Query** - Data fetching and caching

## 📋 Prerequisites

Before running this project, make sure you have the following installed:

- **Node.js** (version 18 or higher) - [Download here](https://nodejs.org/)
- **npm** or **yarn** or **bun** (comes with Node.js)
- A **Web3 wallet** (MetaMask, Coinbase Wallet, etc.) that supports Base network

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/cypherpulse/The-Wall-.git
   cd The-Wall-
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   bun install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory and add your configuration:
   ```env
   VITE_PROJECT_ID=your_reown_project_id_here
   ```
   > Get your project ID from [Reown Dashboard](https://dashboard.reown.com/)

4. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   bun dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173` to see the application running.

## 🔗 WalletConnect Integration Guide

This project uses **Reown AppKit** for seamless wallet connection. Here's how it's integrated:

### Installation

The required packages are already included in `package.json`:

```json
{
  "@reown/appkit": "^1.8.14",
  "@reown/appkit-adapter-wagmi": "^1.8.14",
  "viem": "^2.40.3",
  "wagmi": "^3.0.2"
}
```

### Configuration

1. **Get your Project ID** from [Reown Dashboard](https://dashboard.reown.com/)

2. **Configure AppKit** in `src/config/appkit.tsx`:

```typescript
import { createAppKit } from '@reown/appkit/react'
import { WagmiProvider } from 'wagmi'
import { mainnet, arbitrum, base, type AppKitNetwork } from '@reown/appkit/networks'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { ReactNode } from 'react'

// 0. Setup queryClient
const queryClient = new QueryClient()

// 1. Get projectId from environment
const projectId = import.meta.env.VITE_PROJECT_ID

// 2. Create metadata
const metadata = {
  name: 'THE WALL',
  description: 'Anonymous thoughts. Permanent records. Real connections.',
  url: typeof window !== 'undefined' ? window.location.origin : 'https://example.com',
  icons: ['https://avatars.githubusercontent.com/u/179229932']
}

// 3. Set networks (include Base)
const networks: [AppKitNetwork, ...AppKitNetwork[]] = [mainnet, arbitrum, base]

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
  themeMode: 'light'
})

export function AppKitProvider({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  )
}
```

3. **Wrap your App** in `src/main.tsx`:

```typescript
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { AppKitProvider } from './config/appkit.tsx'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppKitProvider>
      <App />
    </StrictMode>,
)
```

4. **Use in Components**:

```typescript
import { useAppKit } from '@reown/appkit/react'

function ConnectButton() {
  const { open } = useAppKit()

  return (
    <button onClick={() => open()}>
      Connect Wallet
    </button>
  )
}
```

### Supported Networks

- Ethereum Mainnet
- Arbitrum
- **Base** (primary network for this app)

## 📖 Usage

1. **Connect Your Wallet**: Click the connect button and choose your Web3 wallet
2. **Switch to Base Network**: Ensure your wallet is connected to the Base network
3. **Share Your Thoughts**: Create anonymous posts that are permanently stored on-chain via smart contracts
4. **Engage with Others**: Reply to posts and build meaningful connections

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build for development
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### Development Setup

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and ensure tests pass
4. Commit your changes: `git commit -m 'Add amazing feature'`
5. Push to the branch: `git push origin feature/amazing-feature`
6. Open a Pull Request

### Guidelines

- Follow the existing code style
- Write clear, concise commit messages
- Update documentation for any new features
- Ensure all tests pass before submitting
- Respect the anonymous nature of the platform

### Code Style

This project uses ESLint for code linting. Run `npm run lint` to check your code.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙋‍♂️ Support

If you have any questions or need help:

- Open an issue on [GitHub](https://github.com/cypherpulse/The-Wall-/issues)
- Join our community discussions

## 🔗 Links

- [Live Demo](https://your-deployed-url.com) (coming soon)
- [Base Network](https://base.org/)
- [Reown AppKit Documentation](https://docs.reown.com/appkit)
- [WalletConnect](https://walletconnect.com/)

---

Built with ❤️ for the decentralized future

Contributions are welcome! Please feel free to submit a Pull Request.
