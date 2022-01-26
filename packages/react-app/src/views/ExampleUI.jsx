import { SyncOutlined } from "@ant-design/icons";
import { utils } from "ethers";
import { Button, Card, DatePicker, Divider, Input, Progress, Slider, Spin, Switch } from "antd";
import React, { useState } from "react";
import { Address, Balance, Events } from "../components";

export default function ExampleUI({
  magicEarnyPoints,
  address,
  mainnetProvider,
  localProvider,
  yourLocalBalance,
  price,
  tx,
  readContracts,
  writeContracts,
}) {
  const [newVal, setbuyinVal] = useState("1");

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
        <Button type="primary" href="https://scan.thundercore.com/address/0xBACcA15a8d49018cE20e7E354a1B31714e171FC7">Verified Contract</Button>
        <Divider />
        <div style={{ margin: 8 }}>
          <Input defaultValue={"1"} onChange={e => {
            setbuyinVal(e.target.value);
          }} />
          <Button
            onClick={() => {
              /* look how we call setPurpose AND send some value along */
              tx(
                writeContracts.QuarterlyBonus.buyin({
                  value: utils.parseEther(newVal),
                }),
              );
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
              /* this will fail until you make the setPurpose function payable */
            }}
          >
            🤑 Redeem
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
