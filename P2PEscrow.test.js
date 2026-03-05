const { expect } = require("chai");
const { ethers } = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-network-helpers");

describe("P2PEscrow", function () {
  let escrow;
  let mockUSDT;
  let owner, arbitrator, seller, buyer, otherUser;

  const PLATFORM_FEE_BPS = 50; // 0.5%
  const TRADE_AMOUNT = ethers.parseUnits("100", 18); // 100 USDT
  const FIAT_AMOUNT = 130000; // 130,000 SDG
  const DISPUTE_WINDOW = 3600; // 1 hour

  beforeEach(async function () {
    [owner, arbitrator, seller, buyer, otherUser] = await ethers.getSigners();

    // Deploy mock USDT
    const MockERC20 = await ethers.getContractFactory("MockERC20");
    mockUSDT = await MockERC20.deploy("Tether USD", "USDT", 18);

    // Deploy escrow
    const P2PEscrow = await ethers.getContractFactory("P2PEscrow");
    escrow = await P2PEscrow.deploy(arbitrator.address, PLATFORM_FEE_BPS);

    // Add USDT as supported token
    await escrow.addSupportedToken(await mockUSDT.getAddress());

    // Mint USDT to seller
    await mockUSDT.mint(seller.address, ethers.parseUnits("10000", 18));

    // Approve and deposit for seller
    const fee = (TRADE_AMOUNT * BigInt(PLATFORM_FEE_BPS)) / BigInt(10000);
    const totalDeposit = TRADE_AMOUNT + fee;
    await mockUSDT.connect(seller).approve(await escrow.getAddress(), totalDeposit);
    await escrow.connect(seller).deposit(await mockUSDT.getAddress(), totalDeposit);
  });

  // ─────────────────────────────────────────────
  //  Deployment Tests
  // ─────────────────────────────────────────────

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await escrow.owner()).to.equal(owner.address);
    });

    it("Should set the right arbitrator", async function () {
      expect(await escrow.arbitrator()).to.equal(arbitrator.address);
    });

    it("Should set the right fee", async function () {
      expect(await escrow.platformFeeBps()).to.equal(PLATFORM_FEE_BPS);
    });
  });

  // ─────────────────────────────────────────────
  //  Trade Lifecycle Tests
  // ─────────────────────────────────────────────

  describe("Trade Lifecycle", function () {
    it("Should create a trade and lock funds", async function () {
      const fee = (TRADE_AMOUNT * BigInt(PLATFORM_FEE_BPS)) / BigInt(10000);
      const balanceBefore = await escrow.getBalance(await mockUSDT.getAddress(), seller.address);

      const tx = await escrow.connect(seller).createTrade(
        buyer.address,
        await mockUSDT.getAddress(),
        TRADE_AMOUNT,
        FIAT_AMOUNT,
        "SDG",
        "Bank Transfer",
        DISPUTE_WINDOW
      );

      await expect(tx).to.emit(escrow, "TradeCreated");

      const trade = await escrow.getTrade(1);
      expect(trade.seller).to.equal(seller.address);
      expect(trade.buyer).to.equal(buyer.address);
      expect(trade.amount).to.equal(TRADE_AMOUNT);
      expect(trade.status).to.equal(0); // OPEN

      // Funds locked from seller balance
      const balanceAfter = await escrow.getBalance(await mockUSDT.getAddress(), seller.address);
      expect(balanceAfter).to.equal(balanceBefore - TRADE_AMOUNT - fee);
    });

    it("Should allow buyer to mark as paid", async function () {
      await escrow.connect(seller).createTrade(
        buyer.address, await mockUSDT.getAddress(),
        TRADE_AMOUNT, FIAT_AMOUNT, "SDG", "Bank Transfer", DISPUTE_WINDOW
      );

      await expect(escrow.connect(buyer).markAsPaid(1))
        .to.emit(escrow, "TradePaid");

      const trade = await escrow.getTrade(1);
      expect(trade.status).to.equal(1); // PAID
    });

    it("Should release funds to buyer when seller confirms", async function () {
      await escrow.connect(seller).createTrade(
        buyer.address, await mockUSDT.getAddress(),
        TRADE_AMOUNT, FIAT_AMOUNT, "SDG", "Bank Transfer", DISPUTE_WINDOW
      );
      await escrow.connect(buyer).markAsPaid(1);

      const fee = (TRADE_AMOUNT * BigInt(PLATFORM_FEE_BPS)) / BigInt(10000);

      await expect(escrow.connect(seller).releaseFunds(1))
        .to.emit(escrow, "TradeCompleted");

      // Buyer should have the amount
      const buyerBalance = await escrow.getBalance(await mockUSDT.getAddress(), buyer.address);
      expect(buyerBalance).to.equal(TRADE_AMOUNT);

      // Fee collected
      const fees = await escrow.getCollectedFees(await mockUSDT.getAddress());
      expect(fees).to.equal(fee);
    });

    it("Should allow seller to cancel open trade", async function () {
      const fee = (TRADE_AMOUNT * BigInt(PLATFORM_FEE_BPS)) / BigInt(10000);
      const balanceBefore = await escrow.getBalance(await mockUSDT.getAddress(), seller.address);

      await escrow.connect(seller).createTrade(
        buyer.address, await mockUSDT.getAddress(),
        TRADE_AMOUNT, FIAT_AMOUNT, "SDG", "Bank Transfer", DISPUTE_WINDOW
      );

      await expect(escrow.connect(seller).cancelTrade(1))
        .to.emit(escrow, "TradeCancelled");

      // Seller refunded
      const balanceAfter = await escrow.getBalance(await mockUSDT.getAddress(), seller.address);
      expect(balanceAfter).to.equal(balanceBefore);
    });

    it("Should auto-cancel expired trades", async function () {
      await escrow.connect(seller).createTrade(
        buyer.address, await mockUSDT.getAddress(),
        TRADE_AMOUNT, FIAT_AMOUNT, "SDG", "Bank Transfer", DISPUTE_WINDOW
      );

      // Fast forward past deadline
      await time.increase(DISPUTE_WINDOW + 1);

      await escrow.cancelExpiredTrade(1);

      const trade = await escrow.getTrade(1);
      expect(trade.status).to.equal(4); // CANCELLED
    });
  });

  // ─────────────────────────────────────────────
  //  Dispute Tests
  // ─────────────────────────────────────────────

  describe("Disputes", function () {
    beforeEach(async function () {
      await escrow.connect(seller).createTrade(
        buyer.address, await mockUSDT.getAddress(),
        TRADE_AMOUNT, FIAT_AMOUNT, "SDG", "Bank Transfer", DISPUTE_WINDOW
      );
      await escrow.connect(buyer).markAsPaid(1);
    });

    it("Should allow buyer to open dispute", async function () {
      await expect(escrow.connect(buyer).openDispute(1))
        .to.emit(escrow, "TradeDisputed");

      const trade = await escrow.getTrade(1);
      expect(trade.status).to.equal(3); // DISPUTED
    });

    it("Should resolve dispute in buyer's favor", async function () {
      await escrow.connect(buyer).openDispute(1);

      await expect(
        escrow.connect(arbitrator).resolveDispute(1, buyer.address, "Buyer provided payment proof")
      ).to.emit(escrow, "TradeResolved");

      const buyerBalance = await escrow.getBalance(await mockUSDT.getAddress(), buyer.address);
      expect(buyerBalance).to.equal(TRADE_AMOUNT);
    });

    it("Should resolve dispute in seller's favor", async function () {
      const fee = (TRADE_AMOUNT * BigInt(PLATFORM_FEE_BPS)) / BigInt(10000);
      await escrow.connect(buyer).openDispute(1);

      await escrow.connect(arbitrator).resolveDispute(1, seller.address, "No payment proof found");

      const sellerBalance = await escrow.getBalance(await mockUSDT.getAddress(), seller.address);
      expect(sellerBalance).to.equal(TRADE_AMOUNT + fee);
    });

    it("Should not allow non-arbitrator to resolve", async function () {
      await escrow.connect(buyer).openDispute(1);
      await expect(
        escrow.connect(otherUser).resolveDispute(1, buyer.address, "fake")
      ).to.be.revertedWith("Not arbitrator");
    });
  });

  // ─────────────────────────────────────────────
  //  Security Tests
  // ─────────────────────────────────────────────

  describe("Security", function () {
    it("Should not allow non-buyer to mark as paid", async function () {
      await escrow.connect(seller).createTrade(
        buyer.address, await mockUSDT.getAddress(),
        TRADE_AMOUNT, FIAT_AMOUNT, "SDG", "Bank Transfer", DISPUTE_WINDOW
      );
      await expect(escrow.connect(otherUser).markAsPaid(1))
        .to.be.revertedWith("Not buyer");
    });

    it("Should not allow non-seller to release funds", async function () {
      await escrow.connect(seller).createTrade(
        buyer.address, await mockUSDT.getAddress(),
        TRADE_AMOUNT, FIAT_AMOUNT, "SDG", "Bank Transfer", DISPUTE_WINDOW
      );
      await escrow.connect(buyer).markAsPaid(1);
      await expect(escrow.connect(otherUser).releaseFunds(1))
        .to.be.revertedWith("Not seller");
    });

    it("Should not create trade with insufficient balance", async function () {
      const hugeAmount = ethers.parseUnits("999999", 18);
      await expect(
        escrow.connect(seller).createTrade(
          buyer.address, await mockUSDT.getAddress(),
          hugeAmount, FIAT_AMOUNT, "SDG", "Bank Transfer", DISPUTE_WINDOW
        )
      ).to.be.revertedWith("Insufficient balance");
    });

    it("Should not allow fee > 5%", async function () {
      await expect(escrow.updateFee(600)).to.be.revertedWith("Fee too high");
    });

    it("Should not allow unsupported tokens", async function () {
      const fakeToken = otherUser.address;
      await expect(
        escrow.connect(seller).deposit(fakeToken, TRADE_AMOUNT)
      ).to.be.revertedWith("Token not supported");
    });
  });

  // ─────────────────────────────────────────────
  //  Withdrawal Tests
  // ─────────────────────────────────────────────

  describe("Withdrawals", function () {
    it("Should allow withdrawal to external wallet (Binance)", async function () {
      const fee = (TRADE_AMOUNT * BigInt(PLATFORM_FEE_BPS)) / BigInt(10000);

      await escrow.connect(seller).createTrade(
        buyer.address, await mockUSDT.getAddress(),
        TRADE_AMOUNT, FIAT_AMOUNT, "SDG", "Bank Transfer", DISPUTE_WINDOW
      );
      await escrow.connect(buyer).markAsPaid(1);
      await escrow.connect(seller).releaseFunds(1);

      const externalWallet = otherUser.address; // Simulating Binance wallet
      const buyerBalanceBefore = await mockUSDT.balanceOf(externalWallet);

      await escrow.connect(buyer).withdraw(
        await mockUSDT.getAddress(),
        TRADE_AMOUNT,
        externalWallet
      );

      const buyerBalanceAfter = await mockUSDT.balanceOf(externalWallet);
      expect(buyerBalanceAfter - buyerBalanceBefore).to.equal(TRADE_AMOUNT);
      expect(await escrow.getBalance(await mockUSDT.getAddress(), buyer.address)).to.equal(0);
    });
  });
});
