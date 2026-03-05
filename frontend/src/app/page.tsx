import Link from "next/link";

export default function HomePage() {
  return (
    <main className="grid">
      <section className="card">
        <h2>P2P USDT escrow for web + mobile</h2>
        <p>Secure buyer-seller flow with dispute arbitration and real-time updates.</p>
        <Link className="btn" href="/auth/signup">Create account</Link>
      </section>
      <section className="grid grid-2">
        <article className="card"><h3>Escrow safety</h3><p>USDT is locked until release or arbitration.</p></article>
        <article className="card"><h3>Fast settlements</h3><p>Buyer marks paid, seller releases, or auto-release after grace period.</p></article>
      </section>
    </main>
  );
}
