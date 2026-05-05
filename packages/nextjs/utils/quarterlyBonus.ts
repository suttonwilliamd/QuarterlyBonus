import deployedContracts from "~~/contracts/deployedContracts";
import { Address, isAddress } from "viem";

export const quarterlyBonusAbi = [
  {
    inputs: [],
    name: "buyin",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "redeem",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "compound",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "thePot",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "quarterlyBonus",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "lastReset",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "lastQtrPayout",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getMagicEarnyPoints",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

export const getQuarterlyBonusAddress = (chainId: number): Address | undefined => {
  const fromEnv = process.env.NEXT_PUBLIC_QUARTERLYBONUS_ADDRESS;
  if (fromEnv && isAddress(fromEnv)) return fromEnv;

  const contractsForChain = (deployedContracts as any)?.[chainId];
  const fromArtifacts = contractsForChain?.QuarterlyBonus?.address;
  if (fromArtifacts && isAddress(fromArtifacts)) return fromArtifacts;

  return undefined;
};
