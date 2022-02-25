import { SyncOutlined } from "@ant-design/icons";
import { utils } from "ethers";
import { Button, Card, DatePicker, Divider, Input, Progress, Slider, Spin, Switch } from "antd";
import React, { useState } from "react";
import { Address, Balance, Events } from "../components";
import { useEffect } from "react";
import { ethers } from "ethers";
import {
  //useBalance,
  //useContractLoader,
  useContractReader,
  //useGasPrice,
  //useOnBlock,
  //useUserProviderAndSigner,
} from "eth-hooks";

export default function ExampleUI({
  address,
  mainnetProvider,
  localProvider,
  yourLocalBalance,
  price,
  tx,
  readContracts,
  writeContracts,
  balance,
  magicEP,
}) {
  const [newVal, setbuyinVal] = useState("1");
  const [redeemable, setredeemable] = useState(0);
  const [deposited, setdeposited] = useState(0);
  const [earningspersecond, setEPS] = useState(0);
  const [lastRedeem, setLastRedeem] = useState(1);
  const [timeSinceLastRedeem, settimeSinceLastRedeem] = useState(0);
  const [inplay, setinplay] = useState(deposited);
  const [redeemstring, setredeemstring] = useState("");
  //const [magicEP, setmagicEP] = useState(0);
  let d = new Date();
  


  useEffect(() => {
    const interval = setInterval(() => {
      
    d = new Date();
    
    //setmagicEP(readContracts.QuarterlyBonus.magicEarnyPoints)
    setEPS((deposited / 10 / 86400).toFixed(10));
    settimeSinceLastRedeem(Date.now() - lastRedeem);
    setredeemable(earningspersecond * timeSinceLastRedeem);
    setredeemstring(Date.now());



    }, 500);
  
    return () => clearInterval(interval);
  }, [newVal, earningspersecond, lastRedeem, timeSinceLastRedeem, deposited, redeemable]);




  return (
    <div>
      {/*
        ⚙️ Here is an example UI that displays and sets the purpose in your smart contract:
      */}
      <div style={{ border: "1px solid #cccccc", padding: 16, width: 400, margin: "auto", marginTop: 64 }}>
        <h2>Welcome to QuarterlyBonus!</h2>
        <Address
          address={readContracts && readContracts.QuarterlyBonus ? readContracts.QuarterlyBonus.address : null}
          ensProvider={mainnetProvider}
          fontSize={16}
        />
        <br />
        <Button type="primary" href={readContracts && readContracts.QuarterlyBonus ? "https://scan.thundercore.com/address/" + readContracts.QuarterlyBonus.address : null}>Verified Contract</Button>
        <Divider />
        <div style={{ margin: 8 }}>
        
          <Input style={{width: 75}} defaultValue={"1"} onChange={e => {
            setbuyinVal(e.target.value);
          }} />
       <br />

      <h3>Your balance: {ethers.utils.formatEther(yourLocalBalance)}</h3>
       <h3>Deposited:      {magicEP     /*Math.round((deposited + Number.EPSILON) * 100) / 100*/}</h3>
       <h3>In play: {inplay}</h3>
       <h3>EPS: {earningspersecond}</h3>
       <h3>Last Redeem: {lastRedeem}</h3>
       <h3>Time since last redeem: {(timeSinceLastRedeem / 1000).toFixed(0)} seconds ago</h3>
          <Button
            onClick={() => {/* look how we call setPurpose AND send some value along */
              if(ethers.utils.formatEther(yourLocalBalance) > newVal)
              tx(
                writeContracts.QuarterlyBonus.buyin({
                  value: utils.parseEther(newVal),
                }),
                setdeposited(Number(deposited) + Number(newVal)));
                setinplay(Number(inplay) + Number(newVal));
              /* this will fail until you make the setPurpose function payable */
            }}
          >
            💸 Buy in for {newVal} TT
          </Button>
          <div>
          <Button
            onClick={() => {
              /* look how we call setPurpose AND send some value along */
              tx(
                writeContracts.QuarterlyBonus.compound({
                  
                }),
              );
              /* this will fail until you make the setPurpose function payable */
            }}
          >
           💵 Compound
          </Button>
          <Button
            onClick={() => {
              /* look how we call setPurpose AND send some value along */
              tx(
                writeContracts.QuarterlyBonus.redeem({
                }),
              );
              setLastRedeem(Date.now());
              /* this will fail until you make the setPurpose function payable */
            }}
          >
            🤑 Redeem {((redeemable - .002)/1000).toFixed(4)} TT
          </Button>
          </div>
        </div>
        <Divider />


        <p>Welcome to Quarterly Bonus!</p>

        <p>This game accumulates 10% of your buyin *this round* every day.</p>

        <p>A round ends when the contract balance is depleted. You then need to buy in again, therefore this contract is more sustainable than its peers. It does NOT promise returns forever.</p>

        <p>Buy in and withdraw each have a fee of 10%. That is typical for a game like this. What is not typical is what I have chosen to do with this 10%:</p>

        <p>1% is burned. Roughly 7.7% is the developer's fee. The rest goes into the Quarterly Bonus.</p>

        <p>What's the Quarterly Bonus? As the game is played, the Quarterly Bonus pot grows. At the end of 3 months, this pot is split EVENLY between all players.</p>
        <p>This feature was impossible to test on the testnet, but this is how I intend it to work and since we have an immutable ledger, I will manually compensate players if my code has a bug.</p>

        <p>I am NOT a web developer, so I'm aware this website doesn't look great. Thank you for your patience while I make it look better and be more informative.</p>

        <p>If you have anything to say about this. Hatemail, criticisms, offers to help, or do you want to rent some ad space? Email me:</p> <a href="mailto:quarterlyb@gmail.com">quarterlyb@gmail.com</a>











        <Divider />
        Your Address:
        <Address address={address} ensProvider={mainnetProvider} fontSize={16} />
        <Divider />
        <div style={{ margin: 8 }}>
          
        </div>
      </div>


      <div style={{ width: 600, margin: "auto", marginTop: 32, paddingBottom: 256 }}>
        
      </div>
    </div>
  );
}
