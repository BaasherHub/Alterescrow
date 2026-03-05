type Props = { params: { id: string } };

export default function TradeDetailPage({ params }: Props) {
  return (
    <main className="grid grid-2">
      <section className="card">
        <h2>Trade #{params.id}</h2>
        <p>Status: PAID</p>
        <p>Amount: 100 USDT</p>
      </section>
      <section className="card">
        <h3>Chat</h3>
        <p>Socket.io chat messages render here.</p>
      </section>
    </main>
  );
}
