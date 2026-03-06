type Props = { params: { id: string } };

export default function TradeDetailPage({ params }: Props) {
  return (
    <main className="grid grid-2">
      <section className="panel">
        <h2>Order #{params.id}</h2>
        <div className="kpis">
          <div className="kpi"><div className="label">Status</div><div className="value">PAID</div></div>
          <div className="kpi"><div className="label">Amount</div><div className="value">100 USDT</div></div>
          <div className="kpi"><div className="label">Payment Method</div><div className="value">Bank Transfer</div></div>
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
          <button className="btn buy">Release Funds</button>
          <button className="btn sell">Open Dispute</button>
        </div>
      </section>
      <section className="panel">
        <h3>Order Chat</h3>
        <div className="panel" style={{ minHeight: 220, background: "#0d1521", borderColor: "#223147" }}>
          <p className="small">Live trade chat and proof uploads will appear here (Socket.io phase).</p>
        </div>
      </section>
    </main>
  );
}
