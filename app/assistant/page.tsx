"use client";
import { useState } from "react";
import { answer, matches, parseQuery } from "@/lib/assistant.ts";
import { TYPE_LABEL, type Listing } from "@/lib/data.ts";
import { shortNaira } from "@/lib/money.ts";
import { allListings, useStore } from "@/lib/store.ts";
import { ListingCard } from "@/components/ListingCard.tsx";

type Turn = { q: string; text: string; hits: Listing[] };

const EXAMPLES = ["2 bed in Lekki under ₦7m", "Land in Ibeju-Lekki", "What is Governor's Consent?", "The agent wants an inspection fee", "Shortlet in VI"];

export default function Assistant() {
  const s = useStore();
  const [turns, setTurns] = useState<Turn[]>([]);
  const [q, setQ] = useState("");

  const ask = (question: string) => {
    const info = answer(question);
    const f = parseQuery(question);
    const searching = Object.keys(f).length > 0;
    const hits = searching ? allListings(s).filter((l) => matches(l, f)) : [];
    const desc = [f.beds && `${f.beds}+ bed`, f.type && TYPE_LABEL[f.type].toLowerCase(), f.area && `in ${f.area}`, f.maxPrice && `up to ${shortNaira(f.maxPrice)}`].filter(Boolean).join(", ");
    const text = info ?? (searching
      ? hits.length ? `I found ${hits.length} listing${hits.length > 1 ? "s" : ""} (${desc}). Verified ones are marked in green.` : `Nothing matches (${desc}) yet. Try a nearby area or a higher budget.`
      : "I can search listings (\"3 bed in Ikeja under ₦10m\") or explain fees, title documents and how to avoid scams. What would you like?");
    setTurns((t) => [...t, { q: question, text, hits: info ? [] : hits.slice(0, 6) }]);
    setQ("");
  };

  return (
    <div className="wrap section" style={{ maxWidth: 860 }}>
      <h1>Ask U-properties AI</h1>
      <p className="muted">Search in plain English, or ask about fees, documents and staying safe.</p>
      <div className="row" style={{ gap: 6, margin: "12px 0" }}>
        {EXAMPLES.map((e) => <button key={e} className="btn ghost" style={{ flex: "0 0 auto" }} onClick={() => ask(e)}>{e}</button>)}
      </div>
      <div aria-live="polite">
        {turns.map((t, i) => (
          <div key={i} style={{ margin: "18px 0" }}>
            <div className="chat"><div className="bubble me">{t.q}</div><div className="bubble">{t.text}</div></div>
            {t.hits.length > 0 && <div className="grid" style={{ marginTop: 10 }}>{t.hits.map((l) => <ListingCard key={l.id} l={l} />)}</div>}
          </div>
        ))}
      </div>
      <form className="chatbox" onSubmit={(e) => { e.preventDefault(); if (q.trim()) ask(q.trim()); }}>
        <label htmlFor="ask" className="sr-only">Your question</label>
        <input id="ask" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Ask anything about Lagos property…" />
        <button className="btn">Ask</button>
      </form>
    </div>
  );
}
