import Link from "next/link";

const orders = [
  { id: 281, pair: "USDT/SDG", amount: "120", status: "OPEN", side: "BUY" },
  { id: 282, pair: "USDT/NGN", amount: "320", status: "PAID", side: "BUY" },
  { id: 283, pair: "USDT/KES", amount: "90", status: "COMPLETED", side: "SELL" },
];

export default function TradesPage() {
  return (
    <main className="panel">
      <h2>My P2P Orders</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Pair</th>
            <th>Amount</th>
            <th>Side</th>
            <th>Status</th>
            <th>Open</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id}>
              <td>#{o.id}</td>
              <td>{o.pair}</td>
              <td>{o.amount} USDT</td>
              <td>{o.side}</td>
              <td>
                <span className={`status ${o.status === "OPEN" ? "open" : o.status === "PAID" ? "paid" : "done"}`}>
                  {o.status}
                </span>
              </td>
              <td><Link className="btn" href={`/trades/${o.id}`}>View</Link></td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
