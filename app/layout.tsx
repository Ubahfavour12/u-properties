import "./globals.css";
import Link from "next/link";
import type { ReactNode } from "react";

export const metadata = {
  title: "U-properties: verified homes and land in Lagos",
  description: "Find verified rentals, homes for sale, land and short-lets in Lagos. Every listing checked. No fees before viewing.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="header">
          <div className="wrap">
            <Link href="/" className="logo" aria-label="U-properties home">U-<span>properties</span></Link>
            <nav className="nav" aria-label="Main">
              <Link href="/search?type=rent">Rent</Link>
              <Link href="/search?type=sale">Buy</Link>
              <Link href="/search?type=land">Land</Link>
              <Link href="/search?type=shortlet">Short-lets</Link>
              <Link href="/assistant">Ask AI</Link>
              <Link href="/messages">Messages</Link>
              <Link href="/agents/join">For agents</Link>
              <Link href="/agents/list" className="cta">List a property</Link>
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <footer className="footer">
          <div className="wrap">
            <strong>U-properties</strong>: every listing checked, free during launch. Never pay before a viewing.{" "}
            <Link href="/admin">Admin</Link>
          </div>
        </footer>
      </body>
    </html>
  );
}
