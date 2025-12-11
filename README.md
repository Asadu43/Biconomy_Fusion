# 🚀 Biconomy Gasless Transfer Demo

```
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║        💸 GASLESS TOKEN TRANSFERS 💸                         ║
║                                                              ║
║   Transfer ERC-20 tokens without paying gas fees using      ║
║   Biconomy's Gasless Transfer with external wallets         ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
```

> 👋 **New here?** Start with **[START_HERE.md](./START_HERE.md)** for a complete guide!

A React + TypeScript demo application showcasing **Biconomy Gasless Transfer** for gasless token transfers using external wallets (MetaMask, Rabby, etc.).

## ✨ Features

- **Gasless Transfers**: Transfer tokens without needing native gas tokens (ETH)
- **Gasless Transfer**: Uses Biconomy's Companion Account for sponsored transactions
- **External Wallet Support**: Works with MetaMask and any EIP-1193 compatible wallet
- **Sponsorship Enabled**: Gas fees are paid by Biconomy, not the user
- **Ethereum Sepolia Testnet**: Deployed on Ethereum Sepolia for testing

### Traditional vs Gasless Transfer Comparison

| Feature | Traditional Transfer | Gasless Transfer (This App) |
|---------|---------------------|------------------------|
| **Gas Payment** | User pays in ETH | Biconomy sponsors |
| **Signatures Required** | 2 (approve + transfer) | 1 (trigger) |
| **Native Token Needed** | ✅ Yes (ETH) | ❌ No |
| **User Experience** | Complex | Simple |
| **Onboarding Friction** | High | Low |
| **Cost to User** | Gas fees | $0 |

## 🎯 What is Gasless Transfer?

Gasless Transfer allows external wallet users (MetaMask, Rabby, Trust Wallet) to execute transactions where a **Companion Account** (smart account) handles the gas payment. The flow is:

1. **Trigger Signature**: User signs a trigger transaction that authorizes the orchestration
2. **Funds Transfer**: Tokens are temporarily pulled into a Companion Account (non-custodial)
3. **Instruction Execution**: The transfer is executed with gas sponsored by Biconomy
4. **Return to EOA**: Remaining assets are sent back to the user's wallet automatically

### Visual Flow

```
┌─────────────────┐
│  User's Wallet  │
│   (MetaMask)    │
└────────┬────────┘
         │ 1. Sign Trigger
         ▼
┌─────────────────┐
│   Companion     │◄─── Temporary, Non-Custodial
│    Account      │     Smart Account
└────────┬────────┘
         │ 2. Execute Transfer
         │ 3. Gas Paid by Biconomy
         ▼
┌─────────────────┐
│   Recipient     │
│    Address      │
└─────────────────┘
         │
         │ 4. Remaining Tokens Return
         ▼
┌─────────────────┐
│  User's Wallet  │
└─────────────────┘
```

## 🛠️ Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

**📖 Quick Links:**
- 🚀 [Get Started in 3 Steps](./GET_STARTED.md) - Fastest way to run the app
- ⚡ [Quick Start Guide](./QUICKSTART.md) - Detailed setup instructions
- 📚 [Usage Examples](./EXAMPLES.md) - Code examples and patterns
- ❓ [FAQ](./FAQ.md) - Frequently asked questions
- 🧪 [Testing Guide](./TESTING.md) - How to test the application
- 🚢 [Deployment Guide](./DEPLOYMENT.md) - Deploy to production (Netlify)
- ✅ [Project Summary](./PROJECT_SUMMARY.md) - Complete overview

## 📋 Prerequisites

1. **MetaMask** or any EIP-1193 compatible wallet
2. **Ethereum Sepolia Testnet** configured in your wallet
3. **Test tokens** (USDC on Ethereum Sepolia) - Get from faucet

## 🔧 Configuration

The app uses environment variables for configuration. Set these in your `.env` file or Netlify dashboard:

**Required:**
- `BICONOMY_API_KEY` - Your Biconomy API key
- `BICONOMY_PROJECT_ID` - Your Biconomy Project ID

**Optional:**
- `DEFAULT_TOKEN_ADDRESS` - Default token address
- `DEFAULT_TOKEN_DECIMALS` - Token decimals
- `DEFAULT_TOKEN_SYMBOL` - Token symbol
- `DEFAULT_TOKEN_NAME` - Token name

**Note:** In Netlify, variables must use `VITE_` prefix (e.g., `VITE_BICONOMY_API_KEY`). The code uses clean names internally.

## 🎮 Usage

1. **Connect Wallet**: Click "Connect Wallet" and approve MetaMask connection
2. **Enter Details**:
   - Token Address (default: USDC on Base Sepolia)
   - Token Decimals (default: 6 for USDC)
   - Recipient Address
   - Amount to transfer
3. **Transfer**: Click "Transfer with Gasless Transfer"
4. **Sign**: Approve the transaction in your wallet
5. **Done**: Wait for confirmation and view transaction on BaseScan

## 🔑 Key Components

### `WalletConnect.tsx`
Handles wallet connection using Viem's `createWalletClient` with MetaMask.

### `FusionTransfer.tsx`
Implements the complete Gasless Transfer flow:
- Creates Companion Account (Orchestrator)
- Builds transfer instruction
- Gets gasless transfer quote with sponsorship
- Executes and monitors transaction

## 📚 How It Works

```typescript
// 1. Create Companion Account
const orchestrator = await toMultichainNexusAccount({
  chainConfigurations: [{
    chain: baseSepolia,
    transport: http(),
    version: getMEEVersion(MEEVersion.V2_1_0)
  }],
  signer: walletClient
})

// 2. Create MEE Client
const meeClient = await createMeeClient({ account: orchestrator })

// 3. Build transfer instruction
const transferInstruction = await orchestrator.buildComposable({
  type: 'default',
  data: {
    abi: erc20Abi,
    chainId: baseSepolia.id,
    to: tokenAddress,
    functionName: 'transfer',
    args: [recipientAddress, transferAmount]
  }
})

// 4. Get Fusion Quote with Sponsorship
const fusionQuote = await meeClient.getFusionQuote({
  sponsorship: true, // Gas paid by Biconomy
  trigger: {
    chainId: baseSepolia.id,
    tokenAddress: tokenAddress,
    amount: transferAmount
  },
  instructions: [transferInstruction]
})

// 5. Execute
const { hash } = await meeClient.executeFusionQuote({ fusionQuote })
await meeClient.waitForSupertransactionReceipt({ hash })
```

## 🌐 Resources

- [Biconomy Documentation](https://docs.biconomy.io/new/getting-started/enable-mee-eoa-fusion)
- [Gasless Transfer Guide](https://docs.biconomy.io/new/getting-started/enable-mee-eoa-fusion)
- [Ethereum Sepolia Explorer](https://sepolia.etherscan.io/)

## ⚠️ Important Notes

### Gasless Transfer Constraints:
- Can only consume **one token per user signature**
- Token used for execution must also be used to pay for gas (unless sponsorship is enabled)
- With **sponsorship enabled**, any token works and no gas is needed from user

### Trigger Types:
- **ERC20Permit** (ERC-2612): Gasless trigger for tokens supporting permit
- **Onchain Tx**: Requires small gas for `approve()` transaction

The SDK automatically detects token support and chooses the appropriate trigger type.

## 🎨 Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Viem** - Ethereum library
- **Biconomy AbstractJS** - Gasless Transfer SDK
- **Vite** - Build tool

## 🚢 Deployment

This project can be deployed to Netlify with automatic builds from GitHub.

### Quick Deploy to Netlify

1. **Push to GitHub**: The repository is configured for GitHub deployment
2. **Connect to Netlify**: Follow the [Deployment Guide](./DEPLOYMENT.md) for step-by-step instructions
3. **Set Environment Variables**: Configure your Biconomy API keys in Netlify dashboard
4. **Deploy**: Netlify will automatically build and deploy your site

📖 **Full Guide**: See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete deployment instructions including:
- Environment variables setup
- Build configuration
- Custom domain setup
- Troubleshooting tips

## 📝 License

MIT

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit PRs.

---

Built with ❤️ using [Biconomy](https://www.biconomy.io/)

