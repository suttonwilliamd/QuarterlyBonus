"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Address as AddressDisplay, Balance } from "@scaffold-ui/components";
import type { NextPage } from "next";
import { formatEther, parseEther } from "viem";
import { useAccount, useReadContract, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { useTargetNetwork } from "~~/hooks/scaffold-eth";
import { getQuarterlyBonusAddress, quarterlyBonusAbi } from "~~/utils/quarterlyBonus";

const formatTimeAgo = (unixTimestamp?: bigint) => {
  if (!unixTimestamp) return "-";
  const secondsAgo = Math.max(0, Math.floor(Date.now() / 1000 - Number(unixTimestamp)));
  const hours = Math.floor(secondsAgo / 3600);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  return `${Math.floor(secondsAgo / 60)}m ago`;
};

const Home: NextPage = () => {
  const { address: connectedAddress, isConnected, chain } = useAccount();
  const { targetNetwork } = useTargetNetwork();
  const contractAddress = useMemo(() => getQuarterlyBonusAddress(targetNetwork.id), [targetNetwork.id]);
  const wrongNetwork = isConnected && chain?.id !== targetNetwork.id;

  const [buyInAmount, setBuyInAmount] = useState("0.085");
  const [pendingAction, setPendingAction] = useState<"buyin" | "redeem" | "compound" | null>(null);

  const { data: txHash, isPending: isSubmittingTx, writeContract } = useWriteContract();
  const { isLoading: isMiningTx } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  const baseReadConfig = {
    address: contractAddress,
    abi: quarterlyBonusAbi,
    query: {
      enabled: Boolean(contractAddress),
      refetchInterval: 15000,
    },
  } as const;

  const { data: thePot } = useReadContract({
    ...baseReadConfig,
    functionName: "thePot",
  });

  const { data: quarterlyBonus } = useReadContract({
    ...baseReadConfig,
    functionName: "quarterlyBonus",
  });

  const { data: lastReset } = useReadContract({
    ...baseReadConfig,
    functionName: "lastReset",
  });

  const { data: lastQtrPayout } = useReadContract({
    ...baseReadConfig,
    functionName: "lastQtrPayout",
  });

  const { data: myPoints } = useReadContract({
    ...baseReadConfig,
    functionName: "getMagicEarnyPoints",
    account: connectedAddress,
    query: {
      enabled: Boolean(contractAddress && connectedAddress),
      refetchInterval: 15000,
    },
  });

  const actionDisabledReason = useMemo(() => {
    if (!contractAddress) return "Deploy QuarterlyBonus (yarn deploy) so the frontend can auto-detect its address.";
    if (!isConnected) return "Connect wallet to continue.";
    if (wrongNetwork) return `Switch wallet network to ${targetNetwork.name}.`;
    return null;
  }, [contractAddress, isConnected, wrongNetwork, targetNetwork.name]);

  const actionInFlight = isSubmittingTx || isMiningTx;

  const runAction = (action: "buyin" | "redeem" | "compound") => {
    if (!contractAddress || actionDisabledReason) return;

    setPendingAction(action);

    if (action === "buyin") {
      try {
        const value = parseEther(buyInAmount || "0");
        writeContract(
          {
            address: contractAddress,
            abi: quarterlyBonusAbi,
            functionName: "buyin",
            value,
          },
          {
            onSettled: () => setPendingAction(null),
          },
        );
      } catch {
        setPendingAction(null);
      }
      return;
    }

    writeContract(
      {
        address: contractAddress,
        abi: quarterlyBonusAbi,
        functionName: action,
      },
      {
        onSettled: () => setPendingAction(null),
      },
    );
  };

  return (
    <div className="flex items-center flex-col grow pt-10 px-4 pb-20">
      <div className="max-w-6xl w-full space-y-6">
        <div className="card bg-base-200 shadow-xl">
          <div className="card-body">
            <h1 className="card-title text-3xl">QuarterlyBonus</h1>
            <p className="opacity-80">ThunderCore production dashboard — live reads + guarded on-chain actions.</p>
            <div className="flex flex-wrap gap-3 mt-2">
              <span className="badge badge-primary">Chain: {targetNetwork.name}</span>
              <span className="badge badge-secondary">
                Contract: {contractAddress ? "Connected" : "Not configured"}
              </span>
            </div>
            {contractAddress ? (
              <p className="text-sm mt-2 opacity-80 break-all">
                Address: <code>{contractAddress}</code>
              </p>
            ) : null}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <div className="card bg-base-100 shadow">
            <div className="card-body">
              <p className="text-sm opacity-70">Pot</p>
              <p className="text-xl font-semibold">{typeof thePot === "bigint" ? `${formatEther(thePot)} TT` : "-"}</p>
            </div>
          </div>
          <div className="card bg-base-100 shadow">
            <div className="card-body">
              <p className="text-sm opacity-70">Quarterly Bonus Pool</p>
              <p className="text-xl font-semibold">
                {typeof quarterlyBonus === "bigint" ? `${formatEther(quarterlyBonus)} TT` : "-"}
              </p>
            </div>
          </div>
          <div className="card bg-base-100 shadow">
            <div className="card-body">
              <p className="text-sm opacity-70">Last Reset</p>
              <p className="text-xl font-semibold">{formatTimeAgo(lastReset)}</p>
            </div>
          </div>
          <div className="card bg-base-100 shadow">
            <div className="card-body">
              <p className="text-sm opacity-70">Last Quarterly Payout</p>
              <p className="text-xl font-semibold">{formatTimeAgo(lastQtrPayout)}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card bg-base-100 shadow-lg">
            <div className="card-body">
              <h2 className="card-title">Wallet</h2>
              {connectedAddress ? (
                <>
                  <AddressDisplay address={connectedAddress} chain={targetNetwork} />
                  <Balance address={connectedAddress} />
                  <p className="opacity-80 text-sm mt-2">
                    Magic Earny Points:{" "}
                    <strong>{typeof myPoints === "bigint" ? `${formatEther(myPoints)} MEP` : "-"}</strong>
                  </p>
                </>
              ) : (
                <p className="opacity-70">Connect wallet to start playing.</p>
              )}
            </div>
          </div>

          <div className="card bg-base-100 shadow-lg">
            <div className="card-body">
              <h2 className="card-title">Actions</h2>
              <label className="form-control w-full max-w-xs">
                <div className="label">
                  <span className="label-text">Buy In Amount (TT)</span>
                </div>
                <input
                  type="number"
                  min="0"
                  step="0.001"
                  value={buyInAmount}
                  onChange={e => setBuyInAmount(e.target.value)}
                  className="input input-bordered w-full max-w-xs"
                />
              </label>
              <div className="flex flex-wrap gap-3 mt-3">
                <button
                  className="btn btn-primary"
                  disabled={Boolean(actionDisabledReason) || actionInFlight}
                  onClick={() => runAction("buyin")}
                >
                  {pendingAction === "buyin" ? "Submitting..." : "Buy In"}
                </button>
                <button
                  className="btn btn-secondary"
                  disabled={Boolean(actionDisabledReason) || actionInFlight}
                  onClick={() => runAction("redeem")}
                >
                  {pendingAction === "redeem" ? "Submitting..." : "Redeem"}
                </button>
                <button
                  className="btn btn-outline"
                  disabled={Boolean(actionDisabledReason) || actionInFlight}
                  onClick={() => runAction("compound")}
                >
                  {pendingAction === "compound" ? "Submitting..." : "Compound"}
                </button>
              </div>

              {actionDisabledReason ? <p className="text-sm text-warning mt-2">{actionDisabledReason}</p> : null}
              {txHash ? (
                <p className="text-xs mt-2 break-all opacity-80">
                  Latest tx: <code>{txHash}</code>
                </p>
              ) : null}
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <h2 className="card-title">Developer Tools</h2>
            <div className="flex flex-wrap gap-3">
              <Link href="/debug" className="btn btn-primary btn-sm">
                Debug Contracts
              </Link>
              <Link href="/blockexplorer" className="btn btn-outline btn-sm">
                Block Explorer
              </Link>
            </div>
            <p className="text-sm opacity-70 mt-2">
              Note: redeemable amount is calculated in contract state on redeem/compound calls; current contract does
              not expose a pure read-only redeemable preview.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
