export default function WithdrawPage() {
  return (
    <main className="grid grid-2">
      <section className="panel">
        <h2>Withdraw USDT</h2>
        <p className="small">Withdraw from your custodial balance to any external wallet.</p>
        <div className="form-grid" style={{ gridTemplateColumns: "1fr" }}>
          <input className="input" placeholder="Destination wallet address" />
          <input className="input" placeholder="Amount (USDT)" />
          <select className="select">
            <option>BSC (BEP-20)</option>
          </select>
          <button className="btn brand">Submit withdrawal</button>
        </div>
      </section>
      <section className="panel">
        <h3>Risk Controls</h3>
        <ul className="small" style={{ lineHeight: 1.8 }}>
          <li>New accounts may have temporary withdrawal limits.</li>
          <li>Large withdrawals go through manual review queue.</li>
          <li>Final transaction is signed by platform treasury workflow.</li>
        </ul>
      </section>
    </main>
  );
}
