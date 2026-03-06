import Link from "next/link";

const offers = [
  { id: 1, merchant: "Nile Desk", price: "579.20", limit: "50 - 5,000", pay: "Bank Transfer", completion: "98.7%", side: "buy" },
  { id: 2, merchant: "Delta Funds", price: "580.35", limit: "100 - 10,000", pay: "Instant Transfer", completion: "96.9%", side: "buy" },
  { id: 3, merchant: "Atlas Gate", price: "582.10", limit: "25 - 2,500", pay: "Mobile Money", completion: "99.2%", side: "sell" },
];

export default function HomePage() {
  return (
    <main className="grid">
      <section className="panel">
        <h2>P2P USDT Marketplace</h2>
        <p className="small">Trade directly with merchants using local payment methods. Escrow secures every order.</p>
        <div className="kpis" style={{ marginTop: 12 }}>
          <div className="kpi"><div className="label">24h Volume</div><div className="value">$1.24M</div></div>
          <div className="kpi"><div className="label">Online Merchants</div><div className="value">312</div></div>
          <div className="kpi"><div className="label">Success Rate</div><div className="value">98.9%</div></div>
          <div className="kpi"><div className="label">Avg Release</div><div className="value">04:37</div></div>
        </div>
      </section>

      <section className="panel">
        <div className="market-tabs">
          <span className="tab active">Buy USDT</span>
          <span className="tab">Sell USDT</span>
          <span className="tab">USDT/NGN</span>
          <span className="tab">USDT/SDG</span>
          <span className="tab">USDT/KES</span>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>Merchant</th>
              <th>Price</th>
              <th>Limit (USD)</th>
              <th>Payment</th>
              <th>Completion</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {offers.map((o) => (
              <tr key={o.id}>
                <td>{o.merchant}</td>
                <td>{o.price}</td>
                <td>{o.limit}</td>
                <td>{o.pay}</td>
                <td>{o.completion}</td>
                <td>
                  <Link className={`btn ${o.side === "buy" ? "buy" : "sell"}`} href={`/trades/${100 + o.id}`}>
                    {o.side === "buy" ? "Buy" : "Sell"}
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="grid grid-2">
        <article className="panel">
          <h3>Trade Flow</h3>
          <p className="small">Create order -> pay seller -> mark paid -> release from escrow.</p>
          <div className="next-steps">
            <strong>Next Steps Updates</strong>
            <ul>
              <li>Phase 1 complete: escrow contract live flow is defined.</li>
              <li>Phase 2 active: backend custodial account model now in progress.</li>
              <li>Phase 3 active: UI upgraded to exchange-style trading screens.</li>
              <li>Phase 4 pending: real-time chat and order status sockets.</li>
            </ul>
          </div>
        </article>
        <article className="panel">
          <h3>Start Trading</h3>
          <p className="small">New users can sign up and access dashboard wallet instantly.</p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 8 }}>
            <Link href="/auth/signup" className="btn brand">Create Account</Link>
            <Link href="/dashboard" className="btn">Open Wallet</Link>
            <Link href="/trades" className="btn">View Orders</Link>
          </div>
        </article>
      </section>
    </main>
  );
}
