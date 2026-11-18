"use client";
import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AREAS, TYPE_LABEL, type Badge, type ListingType } from "@/lib/data.ts";
import { matches, parseQuery } from "@/lib/assistant.ts";
import { allListings, useStore } from "@/lib/store.ts";
import { ListingCard } from "@/components/ListingCard.tsx";

function Search() {
  const sp = useSearchParams();
  const router = useRouter();
  const s = useStore();
  const fromText = parseQuery(sp.get("q") ?? "");
  const f = {
    type: (sp.get("type") as ListingType) || fromText.type,
    area: sp.get("area") || fromText.area,
    maxPrice: Number(sp.get("max")) || fromText.maxPrice,
    beds: Number(sp.get("beds")) || fromText.beds,
  };
  const badge = sp.get("badge") as Badge | null;
  const results = allListings(s).filter((l) => matches(l, f) && (!badge || l.badge === badge || (badge === "documents" && l.badge === "verified")));

  const set = (k: string, v: string) => {
    const p = new URLSearchParams(sp.toString());
    p.delete("q");
    if (f.type && !p.get("type")) p.set("type", f.type);
    if (f.area && !p.get("area")) p.set("area", f.area);
    if (f.maxPrice && !p.get("max")) p.set("max", String(f.maxPrice));
    if (f.beds && !p.get("beds")) p.set("beds", String(f.beds));
    v ? p.set(k, v) : p.delete(k);
    router.replace(`/search?${p}`);
  };

  return (
    <div className="wrap section layout">
      <aside className="card pad filters" aria-label="Filters">
        <label htmlFor="f-type">Type</label>
        <select id="f-type" value={f.type ?? ""} onChange={(e) => set("type", e.target.value)}>
          <option value="">Any</option>
          {Object.entries(TYPE_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <label htmlFor="f-area">Area</label>
        <select id="f-area" value={f.area ?? ""} onChange={(e) => set("area", e.target.value)}>
          <option value="">All of Lagos</option>
          {AREAS.map((a) => <option key={a}>{a}</option>)}
        </select>
        <label htmlFor="f-max">Max price (₦)</label>
        <input id="f-max" inputMode="numeric" defaultValue={f.maxPrice || ""} key={f.maxPrice}
          onBlur={(e) => set("max", e.target.value.replace(/\D/g, ""))} placeholder="e.g. 5000000" />
        <label htmlFor="f-beds">Min bedrooms</label>
        <select id="f-beds" value={f.beds || ""} onChange={(e) => set("beds", e.target.value)}>
          <option value="">Any</option>
          {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n}+</option>)}
        </select>
        <label htmlFor="f-badge">Checks</label>
        <select id="f-badge" value={badge ?? ""} onChange={(e) => set("badge", e.target.value)}>
          <option value="">All listings</option>
          <option value="documents">Documents checked or better</option>
          <option value="verified">Verified (inspected) only</option>
        </select>
      </aside>
      <section aria-live="polite">
        <h1 style={{ fontSize: 24 }}>{results.length} {results.length === 1 ? "property" : "properties"}{f.area ? ` in ${f.area}` : " in Lagos"}</h1>
        {sp.get("q") && <p className="muted small">Showing results for “{sp.get("q")}”</p>}
        {results.length ? <div className="grid">{results.map((l) => <ListingCard key={l.id} l={l} />)}</div>
          : <div className="card pad">No matches yet. Try a wider area or a higher budget.</div>}
      </section>
    </div>
  );
}

export default function Page() {
  return <Suspense><Search /></Suspense>;
}
