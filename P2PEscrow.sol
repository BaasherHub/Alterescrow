// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title P2PEscrow
 * @notice P2P fiat-to-crypto escrow contract for BSC (BEP-20 USDT)
 * @dev Custodial P2P exchange escrow - handles trade lifecycle, disputes, and fund release
 */

interface IERC20 {
    function transfer(address to, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
}

contract P2PEscrow {

    // ─────────────────────────────────────────────
    //  State Variables
    // ─────────────────────────────────────────────

    address public owner;           // Platform owner (you)
    address public arbitrator;      // Dispute resolver (can be same as owner initially)
    uint256 public platformFeeBps;  // Fee in basis points e.g. 50 = 0.5%
    uint256 public tradeCounter;    // Auto-increment trade ID

    // Supported tokens (USDT, USDC, etc.)
    mapping(address => bool) public supportedTokens;

    // All trades
    mapping(uint256 => Trade) public trades;

    // User balances on platform (token => user => amount)
    mapping(address => mapping(address => uint256)) public platformBalances;

    // Fees accumulated per token
    mapping(address => uint256) public collectedFees;

    // ─────────────────────────────────────────────
    //  Enums & Structs
    // ─────────────────────────────────────────────

    enum TradeStatus {
        OPEN,           // Trade created, crypto locked in escrow
        PAID,           // Buyer marked fiat as sent
        COMPLETED,      // Seller confirmed, crypto released to buyer
        DISPUTED,       // One party raised a dispute
        CANCELLED,      // Trade cancelled before payment
        RESOLVED        // Arbitrator resolved dispute
    }

    struct Trade {
        uint256 id;
        address seller;
        address buyer;
        address token;          // ERC20 token (USDT address on BSC)
        uint256 amount;         // Crypto amount locked
        uint256 fee;            // Platform fee amount
        uint256 fiatAmount;     // For reference only (off-chain fiat)
        string fiatCurrency;    // e.g. "SDG", "NGN", "KES"
        string paymentMethod;   // e.g. "Bank Transfer", "Mobile Money"
        TradeStatus status;
        uint256 createdAt;
        uint256 paidAt;
        uint256 completedAt;
        uint256 disputeDeadline; // Seller auto-releases after this if no dispute
        bool sellerDisputed;
        bool buyerDisputed;
    }

    // ─────────────────────────────────────────────
    //  Events
    // ─────────────────────────────────────────────

    event TradeCreated(
        uint256 indexed tradeId,
        address indexed seller,
        address indexed buyer,
        address token,
        uint256 amount,
        uint256 fiatAmount,
        string fiatCurrency,
        string paymentMethod
    );

    event TradePaid(uint256 indexed tradeId, address indexed buyer, uint256 timestamp);
    event TradeCompleted(uint256 indexed tradeId, address indexed buyer, uint256 amount, uint256 fee);
    event TradeCancelled(uint256 indexed tradeId, address indexed cancelledBy);
    event TradeDisputed(uint256 indexed tradeId, address indexed disputedBy);
    event TradeResolved(uint256 indexed tradeId, address indexed winner, string reason);

    event Deposit(address indexed user, address indexed token, uint256 amount);
    event Withdrawal(address indexed user, address indexed token, uint256 amount, address externalWallet);

    event TokenAdded(address indexed token);
    event TokenRemoved(address indexed token);
    event FeeUpdated(uint256 newFeeBps);
    event ArbitratorUpdated(address newArbitrator);
    event FeesWithdrawn(address indexed token, uint256 amount);

    // ─────────────────────────────────────────────
    //  Modifiers
    // ─────────────────────────────────────────────

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    modifier onlyArbitrator() {
        require(msg.sender == arbitrator || msg.sender == owner, "Not arbitrator");
        _;
    }

    modifier tradeExists(uint256 tradeId) {
        require(trades[tradeId].id == tradeId && tradeId > 0, "Trade not found");
        _;
    }

    modifier onlyTradeSeller(uint256 tradeId) {
        require(trades[tradeId].seller == msg.sender, "Not seller");
        _;
    }

    modifier onlyTradeBuyer(uint256 tradeId) {
        require(trades[tradeId].buyer == msg.sender, "Not buyer");
        _;
    }

    modifier onlyTradeParticipant(uint256 tradeId) {
        require(
            trades[tradeId].seller == msg.sender || trades[tradeId].buyer == msg.sender,
            "Not trade participant"
        );
        _;
    }

    // ─────────────────────────────────────────────
    //  Constructor
    // ─────────────────────────────────────────────

    constructor(address _arbitrator, uint256 _platformFeeBps) {
        require(_arbitrator != address(0), "Invalid arbitrator");
        require(_platformFeeBps <= 500, "Fee too high"); // Max 5%
        owner = msg.sender;
        arbitrator = _arbitrator;
        platformFeeBps = _platformFeeBps;
    }

    // ─────────────────────────────────────────────
    //  Admin Functions
    // ─────────────────────────────────────────────

    function addSupportedToken(address token) external onlyOwner {
        require(token != address(0), "Invalid token");
        supportedTokens[token] = true;
        emit TokenAdded(token);
    }

    function removeSupportedToken(address token) external onlyOwner {
        supportedTokens[token] = false;
        emit TokenRemoved(token);
    }

    function updateFee(uint256 newFeeBps) external onlyOwner {
        require(newFeeBps <= 500, "Fee too high");
        platformFeeBps = newFeeBps;
        emit FeeUpdated(newFeeBps);
    }

    function updateArbitrator(address newArbitrator) external onlyOwner {
        require(newArbitrator != address(0), "Invalid address");
        arbitrator = newArbitrator;
        emit ArbitratorUpdated(newArbitrator);
    }

    function withdrawFees(address token) external onlyOwner {
        uint256 amount = collectedFees[token];
        require(amount > 0, "No fees to withdraw");
        collectedFees[token] = 0;
        require(IERC20(token).transfer(owner, amount), "Transfer failed");
        emit FeesWithdrawn(token, amount);
    }

    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "Invalid address");
        owner = newOwner;
    }

    // ─────────────────────────────────────────────
    //  User Deposit & Withdraw (Platform Wallet)
    // ─────────────────────────────────────────────

    /**
     * @notice Deposit tokens into platform balance
     * @dev Called by backend when user deposits to their platform wallet
     */
    function deposit(address token, uint256 amount) external {
        require(supportedTokens[token], "Token not supported");
        require(amount > 0, "Amount must be > 0");

        require(IERC20(token).transferFrom(msg.sender, address(this), amount), "Transfer failed");
        platformBalances[token][msg.sender] += amount;

        emit Deposit(msg.sender, token, amount);
    }

    /**
     * @notice Withdraw tokens from platform balance to external wallet
     * @dev User can withdraw to Binance or any external wallet
     */
    function withdraw(address token, uint256 amount, address externalWallet) external {
        require(amount > 0, "Amount must be > 0");
        require(externalWallet != address(0), "Invalid wallet");
        require(platformBalances[token][msg.sender] >= amount, "Insufficient balance");

        platformBalances[token][msg.sender] -= amount;
        require(IERC20(token).transfer(externalWallet, amount), "Transfer failed");

        emit Withdrawal(msg.sender, token, amount, externalWallet);
    }

    /**
     * @notice Backend deposits on behalf of user (for custodial wallets)
     * @dev Only owner/backend can call this to credit user balances
     */
    function creditUser(address token, address user, uint256 amount) external onlyOwner {
        require(supportedTokens[token], "Token not supported");
        require(user != address(0), "Invalid user");
        require(amount > 0, "Amount must be > 0");
        platformBalances[token][user] += amount;
    }

    // ─────────────────────────────────────────────
    //  Trade Functions
    // ─────────────────────────────────────────────

    /**
     * @notice Seller creates a trade and locks crypto in escrow
     * @param buyer Address of the buyer
     * @param token ERC20 token address (USDT)
     * @param amount Crypto amount to lock
     * @param fiatAmount Fiat amount buyer will send (reference only)
     * @param fiatCurrency e.g. "SDG", "NGN"
     * @param paymentMethod e.g. "Bank Transfer"
     * @param disputeWindow Seconds seller gives buyer to pay (e.g. 3600 = 1 hour)
     */
    function createTrade(
        address buyer,
        address token,
        uint256 amount,
        uint256 fiatAmount,
        string calldata fiatCurrency,
        string calldata paymentMethod,
        uint256 disputeWindow
    ) external returns (uint256) {
        require(supportedTokens[token], "Token not supported");
        require(buyer != address(0) && buyer != msg.sender, "Invalid buyer");
        require(amount > 0, "Amount must be > 0");
        require(fiatAmount > 0, "Fiat amount must be > 0");
        require(disputeWindow >= 900 && disputeWindow <= 86400, "Window: 15min-24h");

        // Calculate fee
        uint256 fee = (amount * platformFeeBps) / 10000;
        uint256 totalRequired = amount + fee;

        // Check seller has enough platform balance
        require(platformBalances[token][msg.sender] >= totalRequired, "Insufficient balance");

        // Lock funds from seller's platform balance
        platformBalances[token][msg.sender] -= totalRequired;

        // Create trade
        tradeCounter++;
        uint256 tradeId = tradeCounter;

        trades[tradeId] = Trade({
            id: tradeId,
            seller: msg.sender,
            buyer: buyer,
            token: token,
            amount: amount,
            fee: fee,
            fiatAmount: fiatAmount,
            fiatCurrency: fiatCurrency,
            paymentMethod: paymentMethod,
            status: TradeStatus.OPEN,
            createdAt: block.timestamp,
            paidAt: 0,
            completedAt: 0,
            disputeDeadline: block.timestamp + disputeWindow,
            sellerDisputed: false,
            buyerDisputed: false
        });

        emit TradeCreated(tradeId, msg.sender, buyer, token, amount, fiatAmount, fiatCurrency, paymentMethod);
        return tradeId;
    }

    /**
     * @notice Buyer marks fiat payment as sent
     * @dev Off-chain action, just updates status on-chain
     */
    function markAsPaid(uint256 tradeId)
        external
        tradeExists(tradeId)
        onlyTradeBuyer(tradeId)
    {
        Trade storage trade = trades[tradeId];
        require(trade.status == TradeStatus.OPEN, "Trade not open");
        require(block.timestamp <= trade.disputeDeadline, "Trade window expired");

        trade.status = TradeStatus.PAID;
        trade.paidAt = block.timestamp;

        emit TradePaid(tradeId, msg.sender, block.timestamp);
    }

    /**
     * @notice Seller confirms fiat received and releases crypto to buyer
     */
    function releaseFunds(uint256 tradeId)
        external
        tradeExists(tradeId)
        onlyTradeSeller(tradeId)
    {
        Trade storage trade = trades[tradeId];
        require(
            trade.status == TradeStatus.PAID || trade.status == TradeStatus.DISPUTED,
            "Cannot release at this stage"
        );

        _completeTrade(trade);
    }

    /**
     * @notice Auto-release if buyer paid and seller didn't respond within deadline
     * @dev Anyone can call this after deadline to protect buyers
     */
    function autoRelease(uint256 tradeId) external tradeExists(tradeId) {
        Trade storage trade = trades[tradeId];
        require(trade.status == TradeStatus.PAID, "Trade not in PAID status");
        require(block.timestamp > trade.disputeDeadline + 3600, "Release window not reached"); // 1hr after deadline

        _completeTrade(trade);
    }

    /**
     * @notice Seller cancels trade (only if buyer hasn't paid yet)
     */
    function cancelTrade(uint256 tradeId)
        external
        tradeExists(tradeId)
        onlyTradeSeller(tradeId)
    {
        Trade storage trade = trades[tradeId];
        require(trade.status == TradeStatus.OPEN, "Can only cancel open trades");

        trade.status = TradeStatus.CANCELLED;

        // Refund seller
        platformBalances[trade.token][trade.seller] += trade.amount + trade.fee;

        emit TradeCancelled(tradeId, msg.sender);
    }

    /**
     * @notice Cancel expired trade (buyer never paid)
     */
    function cancelExpiredTrade(uint256 tradeId) external tradeExists(tradeId) {
        Trade storage trade = trades[tradeId];
        require(trade.status == TradeStatus.OPEN, "Trade not open");
        require(block.timestamp > trade.disputeDeadline, "Trade not expired");

        trade.status = TradeStatus.CANCELLED;

        // Refund seller
        platformBalances[trade.token][trade.seller] += trade.amount + trade.fee;

        emit TradeCancelled(tradeId, msg.sender);
    }

    /**
     * @notice Raise a dispute on a trade
     */
    function openDispute(uint256 tradeId)
        external
        tradeExists(tradeId)
        onlyTradeParticipant(tradeId)
    {
        Trade storage trade = trades[tradeId];
        require(
            trade.status == TradeStatus.OPEN || trade.status == TradeStatus.PAID,
            "Cannot dispute at this stage"
        );

        if (msg.sender == trade.seller) {
            trade.sellerDisputed = true;
        } else {
            trade.buyerDisputed = true;
        }

        trade.status = TradeStatus.DISPUTED;

        emit TradeDisputed(tradeId, msg.sender);
    }

    /**
     * @notice Arbitrator resolves a dispute
     * @param winner Address of winner (must be seller or buyer)
     * @param reason Short reason string for transparency
     */
    function resolveDispute(
        uint256 tradeId,
        address winner,
        string calldata reason
    ) external onlyArbitrator tradeExists(tradeId) {
        Trade storage trade = trades[tradeId];
        require(trade.status == TradeStatus.DISPUTED, "Trade not disputed");
        require(winner == trade.seller || winner == trade.buyer, "Winner must be participant");

        trade.status = TradeStatus.RESOLVED;
        trade.completedAt = block.timestamp;

        if (winner == trade.buyer) {
            // Buyer wins: release crypto to buyer, collect fee
            platformBalances[trade.token][trade.buyer] += trade.amount;
            collectedFees[trade.token] += trade.fee;
        } else {
            // Seller wins: refund seller, return fee
            platformBalances[trade.token][trade.seller] += trade.amount + trade.fee;
        }

        emit TradeResolved(tradeId, winner, reason);
    }

    // ─────────────────────────────────────────────
    //  Internal Functions
    // ─────────────────────────────────────────────

    function _completeTrade(Trade storage trade) internal {
        trade.status = TradeStatus.COMPLETED;
        trade.completedAt = block.timestamp;

        // Credit buyer
        platformBalances[trade.token][trade.buyer] += trade.amount;

        // Collect platform fee
        collectedFees[trade.token] += trade.fee;

        emit TradeCompleted(trade.id, trade.buyer, trade.amount, trade.fee);
    }

    // ─────────────────────────────────────────────
    //  View Functions
    // ─────────────────────────────────────────────

    function getTrade(uint256 tradeId) external view returns (Trade memory) {
        return trades[tradeId];
    }

    function getBalance(address token, address user) external view returns (uint256) {
        return platformBalances[token][user];
    }

    function getCollectedFees(address token) external view returns (uint256) {
        return collectedFees[token];
    }

    function isTokenSupported(address token) external view returns (bool) {
        return supportedTokens[token];
    }
}
