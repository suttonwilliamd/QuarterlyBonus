# QuarterlyBonus

A Solidity smart contract game where employees buy in with ETH to earn magic points and redeemable earnings over time. The contract manages quarterly payouts, round resets, and compound mechanics.

## Game Mechanics

### BuyIn
- Players send ETH to join
- If accumulated points >= 0.085 ETH (~$200 target) and not already an employee, user becomes an employee
- Dev fee (7.69%), quarterly bonus allocation (2.5%), and burn (0.39%) are deducted
- Remaining ETH goes to "the pot"

### Earning (Accrual)
- Users earn points based on their magicEarnyPoints balance
- Points accrue at `magicEarnyPoints / 10 / 1 day` per second
- Accrual starts from lastRedeem timestamp (initialized to block.timestamp on first interaction)

### Redeem
- Users can redeem their accrued earnings at any time
- Amount is clamped to the pot balance (prevents overdrawing)
- Same fee structure as buyin applies

### Compound
- Users can compound their accrued earnings back into their magicEarnyPoints
- This increases future accrual rate

### Round Reset
- Triggers after 1 week without pot reaching 1 ETH
- Clears employee membership for all current employees
- Resets magicEarnyPoints, earningsPerSecond, redeemable to 0
- Increments round counter

### Quarterly Payout
- Triggers after ~91 days (7,890,000 seconds)
- Distributes quarterlyBonus pool equally among all employees
- Clears employee array

## Key Risks

1. **Reentrancy**: Protected with OpenZeppelin ReentrancyGuard
2. **Divide-by-zero**: Payout path checks for zero employees before division
3. **Timestamp manipulation**: Block timestamps can be slightly manipulated by miners
4. **No access control**: Anyone can call any function
5. **Pot exhaustion**: Large redemptions can drain the pot

## Running Tests

```bash
cd packages/hardhat
npm install
npm test
```

## Configuration

Default deployment network is now `thunder` (ThunderCore mainnet).

Set environment variables for network deployments:
- `THUNDER_RPC_URL` - ThunderCore mainnet RPC (default: `https://mainnet-rpc.thundercore.com/`)
- `TESTTHUNDER_RPC_URL` - ThunderCore testnet RPC (default: `https://testnet-rpc.thundercore.com/`)
- `ETHERSCAN_API_KEY` - Etherscan API key for Ethereum verification paths (if used)

Reference `packages/hardhat/example.env` for available options.