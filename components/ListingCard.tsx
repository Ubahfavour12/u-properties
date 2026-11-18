import Link from "next/link";
import { BADGE_LABEL, TYPE_LABEL, type Badge, type Listing } from "@/lib/data.ts";
import { priceLabel } from "@/lib/money.ts";

export function BadgeChip({ badge }: { badge: Badge }) {
  return <span className={`chip ${badge}`}>{badge === "verified" ? "✓ " : ""}{BADGE_LABEL[badge]}</span>;
}

// shortcut: drawn placeholder instead of real photos, until agents upload images to storage.
export function Photo({ l, big }: { l: Listing; big?: boolean }) {
  return (
    <div className="photo" style={{ background: `linear-gradient(135deg, hsl(${l.hue} 45% 78%), hsl(${l.hue + 30} 40% 60%))`, aspectRatio: big ? "16/8" : undefined, borderRadius: big ? 12 : 0 }}
      role="img" aria-label={`Photo placeholder for ${l.title}`}>
      <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5" aria-hidden="true"><path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z" /></svg>
      <BadgeChip badge={l.badge} />
      <span className="chip">{TYPE_LABEL[l.type]}</span>
    </div>
  );
}

export function ListingCard({ l }: { l: Listing }) {
  const facts = l.type === "land" ? `${l.plotSqm?.toLocaleString()} sqm · ${l.titleDoc}` : `${l.beds} bed · ${l.baths} bath${l.titleDoc ? ` · ${l.titleDoc}` : ""}`;
  return (
    <Link href={`/listing/${l.id}`} className="card lcard">
      <Photo l={l} />
      <div className="body">
        <div className="price">{priceLabel(l)}</div>
        <div>{l.title}</div>
        <div className="muted small">{l.area} · {facts}</div>
      </div>
    </Link>
  );
}
