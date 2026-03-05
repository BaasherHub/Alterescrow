import Link from "next/link";

const sample = [
  { id: 101, pair: "USDT/SDG", amount: "100", status: "OPEN" },
  { id: 102, pair: "USDT/NGN", amount: "250", status: "PAID" },
];

export default function TradesPage() {
  return (
    <main className="card">
      <h2>Trade Listings</h2>
      <div className="grid">
        {sample.map((t) => (
          <Link key={t.id} href={`/trades/${t.id}`} className="card">
            <strong>Trade #{t.id}</strong>
            <p>{t.pair} - {t.amount} USDT</p>
            <span className="pill">{t.status}</span>
          </Link>
        ))}
      </div>
    </main>
  );
}
