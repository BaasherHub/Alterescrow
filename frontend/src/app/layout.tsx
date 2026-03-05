import "./globals.css";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AlterEscrow",
  description: "P2P escrow for USDT trades",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="container">
          <header>
            <h1>AlterEscrow</h1>
            <span className="pill">alterescrow.com</span>
            <nav className="nav">
              <Link href="/">Home</Link>
              <Link href="/auth/login">Login</Link>
              <Link href="/auth/signup">Signup</Link>
              <Link href="/dashboard">Dashboard</Link>
              <Link href="/trades">Trades</Link>
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
