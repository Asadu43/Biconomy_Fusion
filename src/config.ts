import { polygon } from 'viem/chains'

// Environment variable mapping
// Note: Vite requires VITE_ prefix, but we use clean names internally
const getEnvVar = (cleanName: string, defaultValue?: string): string => {
  const viteKey = `VITE_${cleanName}`
  const value = import.meta.env[viteKey]
  if (!value && !defaultValue) {
    console.warn(`⚠️ Environment variable ${cleanName} is not set (expected: ${viteKey})`)
  }
  return value || defaultValue || ''
}

export const config = {
  // Network configuration - Polygon Mainnet
  chain: polygon,
  
  // Default token configuration
  defaultToken: {
    address: (getEnvVar('DEFAULT_TOKEN_ADDRESS') || '') as `0x${string}`,
    decimals: Number(getEnvVar('DEFAULT_TOKEN_DECIMALS') || ''),
    symbol: getEnvVar('DEFAULT_TOKEN_SYMBOL') || '',
    name: getEnvVar('DEFAULT_TOKEN_NAME') || ''
  },
  
  // Biconomy configuration (REQUIRED)
  biconomy: {
    apiKey: getEnvVar('BICONOMY_API_KEY'),
    projectId: getEnvVar('BICONOMY_PROJECT_ID'),
  },
  
  // Explorer URLs
  explorer: {
    baseUrl: 'https://meescan.biconomy.io',
    tx: (hash: string) => `https://meescan.biconomy.io/details/${hash}`,
    address: (address: string) => `https://polygonscan.com/address/${address}`,
  }
}

// Validate critical configuration
if (!config.biconomy.apiKey) {
  console.error('❌ BICONOMY_API_KEY is required. Please set VITE_BICONOMY_API_KEY in your environment variables.')
}

if (!config.biconomy.projectId) {
  console.error('❌ BICONOMY_PROJECT_ID is required. Please set VITE_BICONOMY_PROJECT_ID in your environment variables.')
}


