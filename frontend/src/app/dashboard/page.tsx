export default function DashboardPage() {
  return (
    <main className="grid">
      <section className="panel">
        <h2>Wallet Dashboard</h2>
        <div className="kpis">
          <div className="kpi"><div className="label">Available USDT</div><div className="value">0.00</div></div>
          <div className="kpi"><div className="label">Locked in Escrow</div><div className="value">0.00</div></div>
          <div className="kpi"><div className="label">Total P2P Orders</div><div className="value">0</div></div>
          <div className="kpi"><div className="label">Avg Completion</div><div className="value">-</div></div>
        </div>
      </section>

      <section className="grid grid-2">
        <article className="panel">
          <h3>Recent Activity</h3>
          <p className="small">No orders yet. Your first completed order will appear here.</p>
        </article>
        <article className="panel next-steps">
          <h3 style={{ marginTop: 0 }}>Next Steps Updates</h3>
          <ul>
            <li>Set `NEXT_PUBLIC_API_BASE_URL` to production backend URL.</li>
            <li>Create first admin account using `ADMIN_EMAIL` from backend env.</li>
            <li>Complete KMS treasury signing flow before withdrawals go live.</li>
            <li>Add risk checks: velocity limits, withdrawal hold windows.</li>
          </ul>
        </article>
      </section>
    </main>
  );
}
