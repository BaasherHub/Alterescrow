import "./globals.css";
import Link from "next/link";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "AlterEscrow P2P",
  description: "P2P marketplace inspired by leading exchanges",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="container">
          <header>
            <div className="topbar">
              <div className="brand">
                <div className="brand-badge">A</div>
                <div>
                  <h1 style={{ margin: 0 }}>AlterEscrow P2P</h1>
                  <span className="domain-chip">www.alterescrow.com</span>
                </div>
              </div>
              <div className="top-actions">
                <span className="dot" />
                <span className="small">Live Beta</span>
                <Link href="/auth/login" className="btn">Sign in</Link>
                <Link href="/auth/signup" className="btn brand">Get Started</Link>
              </div>
            </div>
            <nav className="menu">
              <Link href="/">P2P Market</Link>
              <Link href="/trades">My Orders</Link>
              <Link href="/dashboard">Wallet</Link>
              <Link href="/withdraw">Withdraw</Link>
              <Link href="/admin">Admin</Link>
            </nav>
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}
