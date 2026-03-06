export default function AdminPage() {
  return (
    <main className="grid">
      <section className="panel">
        <h2>Admin Command Center</h2>
        <div className="kpis">
          <div className="kpi"><div className="label">Open Disputes</div><div className="value">4</div></div>
          <div className="kpi"><div className="label">Pending Withdrawals</div><div className="value">7</div></div>
          <div className="kpi"><div className="label">Flagged Accounts</div><div className="value">2</div></div>
          <div className="kpi"><div className="label">Collected Fees</div><div className="value">1,242 USDT</div></div>
        </div>
      </section>

      <section className="grid grid-2">
        <article className="panel">
          <h3>Dispute Queue</h3>
          <p className="small">Review evidence, decide winner, execute `resolveDispute` flow.</p>
          <button className="btn">Open disputes panel</button>
        </article>
        <article className="panel">
          <h3>Withdraw Queue</h3>
          <p className="small">Approve/reject pending requests before KMS signing.</p>
          <button className="btn">Open withdrawal queue</button>
        </article>
      </section>
    </main>
  );
}
