"use client";

import Link from "next/link";
import { Address, Balance } from "@scaffold-ui/components";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { useTargetNetwork } from "~~/hooks/scaffold-eth";

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();
  const { targetNetwork } = useTargetNetwork();

  return (
    <div className="flex items-center flex-col grow pt-10 px-4 pb-20">
      <div className="max-w-5xl w-full space-y-6">
        <div className="card bg-base-200 shadow-xl">
          <div className="card-body">
            <h1 className="card-title text-3xl">QuarterlyBonus</h1>
            <p className="opacity-80">
              ThunderCore-native on-chain game dashboard (Scaffold-ETH 2 migration baseline).
            </p>
            <div className="flex flex-wrap gap-3 mt-2">
              <span className="badge badge-primary">Chain: {targetNetwork.name}</span>
              <span className="badge badge-secondary">Contract: QuarterlyBonus</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card bg-base-100 shadow-lg">
            <div className="card-body">
              <h2 className="card-title">Wallet</h2>
              {connectedAddress ? (
                <>
                  <Address address={connectedAddress} chain={targetNetwork} />
                  <div className="mt-2">
                    <Balance address={connectedAddress} className="text-lg" />
                  </div>
                </>
              ) : (
                <p className="opacity-70">Connect wallet to start playing.</p>
              )}
            </div>
          </div>

          <div className="card bg-base-100 shadow-lg">
            <div className="card-body">
              <h2 className="card-title">Next Build Targets</h2>
              <ul className="list-disc pl-5 space-y-1 opacity-90">
                <li>Live pot + quarterly bonus pool reads</li>
                <li>Buy In / Redeem / Compound write actions</li>
                <li>Employee count + round timing cards</li>
                <li>Transaction history and payout transparency</li>
              </ul>
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
              Wire deployed contract data in <code>packages/nextjs/contracts/</code> after deployment.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
