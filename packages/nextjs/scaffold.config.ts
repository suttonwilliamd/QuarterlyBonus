import * as chains from "viem/chains";
import { defineChain } from "viem";

export type ScaffoldConfig = {
  targetNetworks: readonly chains.Chain[];
  pollingInterval: number;
  alchemyApiKey: string;
  rpcOverrides?: Record<number, string>;
  walletConnectProjectId: string;
  burnerWalletMode: "localNetworksOnly" | "allNetworks" | "disabled";
};

export const DEFAULT_ALCHEMY_API_KEY = "cR4WnXePioePZ5fFrnSiR";

export const thunderCore = defineChain({
  id: 108,
  name: "ThunderCore",
  nativeCurrency: { name: "Thunder Token", symbol: "TT", decimals: 18 },
  rpcUrls: {
    default: { http: [process.env.NEXT_PUBLIC_THUNDER_RPC_URL || "https://mainnet-rpc.thundercore.com/"] },
    public: { http: [process.env.NEXT_PUBLIC_THUNDER_RPC_URL || "https://mainnet-rpc.thundercore.com/"] },
  },
  blockExplorers: {
    default: { name: "ThunderCore Explorer", url: "https://viewblock.io/thundercore" },
  },
});

export const thunderCoreTestnet = defineChain({
  id: 18,
  name: "ThunderCore Testnet",
  nativeCurrency: { name: "Thunder Token", symbol: "TT", decimals: 18 },
  rpcUrls: {
    default: { http: [process.env.NEXT_PUBLIC_TESTTHUNDER_RPC_URL || "https://testnet-rpc.thundercore.com/"] },
    public: { http: [process.env.NEXT_PUBLIC_TESTTHUNDER_RPC_URL || "https://testnet-rpc.thundercore.com/"] },
  },
  blockExplorers: {
    default: { name: "ThunderCore Testnet Explorer", url: "https://explorer-testnet.thundercore.com" },
  },
  testnet: true,
});

const scaffoldConfig = {
  targetNetworks: [thunderCore, thunderCoreTestnet],
  pollingInterval: 3000,
  alchemyApiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY || DEFAULT_ALCHEMY_API_KEY,
  rpcOverrides: {
    [thunderCore.id]: process.env.NEXT_PUBLIC_THUNDER_RPC_URL || "https://mainnet-rpc.thundercore.com/",
    [thunderCoreTestnet.id]:
      process.env.NEXT_PUBLIC_TESTTHUNDER_RPC_URL || "https://testnet-rpc.thundercore.com/",
  },
  walletConnectProjectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || "3a8170812b534d0ff9d794f19a901d64",
  burnerWalletMode: "allNetworks",
} as const satisfies ScaffoldConfig;

export default scaffoldConfig;
