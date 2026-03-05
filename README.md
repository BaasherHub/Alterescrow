# P2P Exchange - Smart Contracts

Escrow smart contract for P2P fiat-to-crypto trading on BSC (Binance Smart Chain).

## Overview

The `P2PEscrow` contract handles:
- Locking seller's USDT in escrow when a trade is created
- Releasing funds to buyer when seller confirms fiat received
- Dispute resolution by arbitrator (you)
- Platform fee collection (0.5%)
- User platform balances (custodial model)
- Withdrawal to external wallets (Binance etc.)

## Trade Flow

```
1. Seller has USDT in platform balance
2. Seller creates trade → USDT locked in escrow
3. Buyer sends fiat (bank transfer / mobile money)
4. Buyer clicks "I've Paid" → markAsPaid()
5. Seller confirms fiat received → releaseFunds()
6. USDT credited to buyer's platform balance
7. Buyer can withdraw to Binance anytime
```

## Dispute Flow

```
Either party opens dispute → openDispute()
Arbitrator reviews evidence in chat
Arbitrator resolves → resolveDispute(winner, reason)
```

## Setup

```bash
npm install
cp .env.example .env
# Fill in your private key and addresses in .env
```

## Testing

```bash
npm test
```

## Deploy to BSC Testnet (test first!)

```bash
# Get free BNB testnet tokens from: https://testnet.binance.org/faucet-smart
npm run deploy:testnet
```

## Deploy to BSC Mainnet (production)

```bash
# Make sure you have real BNB for gas (~$5-10 worth)
npm run deploy:mainnet
```

## Contract Addresses

| Network | Address |
|---------|---------|
| BSC Testnet | TBD after deployment |
| BSC Mainnet | TBD after deployment |

## USDT Addresses on BSC

| Network | USDT Address |
|---------|-------------|
| BSC Testnet | `0x337610d27c682E347C9cD60BD4b3b107C9d34dDd` |
| BSC Mainnet | `0x55d398326f99059fF775485246999027B3197955` |

## Platform Fee

Currently set to **0.5%** (50 basis points).
- Collected from seller on each completed trade
- Withdrawable by owner via `withdrawFees(tokenAddress)`

## Security Notes

- Contract uses no external dependencies (no OpenZeppelin) for simplicity
- Private keys for custodial wallets are managed off-chain via KMS
- Always test on BSC Testnet before mainnet
- Consider a professional audit before handling large volumes
