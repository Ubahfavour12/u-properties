import Link from "next/link";
import { LISTINGS } from "@/lib/data.ts";
import { ListingCard } from "@/components/ListingCard.tsx";

export default function Home() {
  const featured = LISTINGS.filter((l) => l.badge === "verified").slice(0, 6);
  return (
    <>
      <section className="hero">
        <div className="wrap">
          <h1>Verified homes and land in Lagos. No fake listings.</h1>
          <p>Every agent is ID-checked and every listing's documents are scanned. Never pay before a viewing.</p>
          <form action="/search" className="searchbar" role="search">
            <label htmlFor="q" className="sr-only">Search</label>
            <input id="q" name="q" placeholder='Try "2 bed in Lekki under ₦7m" or "land in Ibeju-Lekki"' />
            <button className="btn" type="submit">Search</button>
          </form>
          <div className="tabs">
            <Link href="/search?type=rent">To rent</Link>
            <Link href="/search?type=sale">For sale</Link>
            <Link href="/search?type=land">Land</Link>
            <Link href="/search?type=shortlet">Short-lets</Link>
            <Link href="/assistant">Ask the AI assistant →</Link>
          </div>
        </div>
      </section>

      <section className="section wrap">
        <h2>Verified this week</h2>
        <div className="grid">{featured.map((l) => <ListingCard key={l.id} l={l} />)}</div>
      </section>

      <section className="section wrap">
        <div className="grid">
          <div className="card pad"><h3>Checked agents</h3><p className="muted">NIN, selfie and CAC checks before anyone can list.</p></div>
          <div className="card pad"><h3>Checked documents</h3><p className="muted">Titles, survey plans and mandates scanned, and land searched at the registry.</p></div>
          <div className="card pad"><h3>Fair, fixed fees</h3><p className="muted">Agency and legal fees are capped and shown upfront. Agents can't add anything else.</p></div>
          <div className="card pad"><h3>Talk safely</h3><p className="muted">Chat, email or call through the U-properties line. Your number stays private.</p></div>
        </div>
      </section>
    </>
  );
}
