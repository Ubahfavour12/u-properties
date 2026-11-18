import { AREAS, type Listing, type ListingType } from "./data.ts";

// shortcut: rule-based assistant so the MVP runs with no API key; swap for a Claude API call when going live.

const ALIASES: [RegExp, string][] = [
  [/\bvi\b|victoria island/, "Victoria Island"],
  [/\blekki\b/, "Lekki Phase 1"],
  [/\bikeja\b/, "Ikeja GRA"],
  [/\bfestac\b/, "Festac"],
];

export type Filters ={ type?: ListingType; area?: string; maxPrice?: number; beds?: number };

const parseAmount = (num: string, unit: string) => {
  const n = parseFloat(num.replace(/,/g, ""));
  const u = unit.toLowerCase();
  return u.startsWith("b") ? n * 1e9 : u.startsWith("m") ? n * 1e6 : u.startsWith("k") ? n * 1e3 : n;
};

export function parseQuery(q: string): Filters {
  const s = q.toLowerCase();
  const f: Filters = {};
  if (/short[\s-]?let|per night|airbnb|nights?\b/.test(s)) f.type = "shortlet";
  else if (/\b(land|plot)s?\b/.test(s)) f.type = "land";
  else if (/\b(buy|sale|purchase|own)\b/.test(s)) f.type = "sale";
  else if (/\b(rent|let|lease|flat|self[\s-]?contain|mini flat|apartment)\b/.test(s)) f.type = "rent";
  // Full names first so "Ibeju-Lekki" isn't read as "Lekki"; then short aliases.
  const area = AREAS.find((a) => s.includes(a.toLowerCase())) ??
    ALIASES.find(([re]) => re.test(s))?.[1];
  if (area) f.area = area;
  const price = s.match(/(?:under|below|less than|max(?:imum)?|budget(?: of)?|within)\s*₦?\s*([\d.,]+)\s*(bn|billion|m|million|k|thousand)?/);
  if (price) f.maxPrice = parseAmount(price[1], price[2] ?? "");
  const beds = s.match(/(\d+)\s*[- ]?(?:bed|bedroom|br)/);
  if (beds) f.beds = +beds[1];
  else if (/self[\s-]?contain|mini flat|studio/.test(s)) f.beds = 1;
  return f;
}

export const matches = (l: Listing, f: Filters) =>
  (!f.type || l.type === f.type) &&
  (!f.area || l.area === f.area) &&
  (!f.maxPrice || l.price <= f.maxPrice) &&
  (!f.beds || (l.beds ?? 0) >= f.beds);

const FAQ: [RegExp, string][] = [
  [/c of o|certificate of occupancy/, "A Certificate of Occupancy (C of O) is issued by the state government and shows the right to use the land for 99 years. On U-properties, a partner lawyer checks it against the Lagos Land Registry before a sale or land listing gets a badge."],
  [/governor'?s consent/, "Governor's Consent is the approval needed when land that already has a C of O changes hands. It is the strongest title for a resale. Ask to see the registered consent, not just the application."],
  [/excision|gazette/, "Excision means the government released land from its acquisition to the original community. A gazette publishes that release. Land that is excised and gazetted is safer to buy than land that is only 'under excision'."],
  [/survey/, "A registered survey plan shows the exact boundaries of a plot. A surveyor 'charting' it confirms the land is not under government acquisition. We do this for every land listing."],
  [/inspection fee|pay before|pay to view|viewing fee/, "Never pay before a viewing. U-properties agents are not allowed to charge inspection fees. If anyone asks, tap 'Report listing' and we'll suspend them."],
  [/agency fee|agent fee|legal fee|commission/, "On U-properties, agency and legal fees are each capped at 10% of the yearly rent or price, and every fee is shown on the listing. Agents can't add any other charges."],
  [/caution|deposit/, "A caution deposit covers damage and is refundable when you move out, minus any repairs. It is shown separately on every rental."],
  [/service charge/, "Service charge pays for shared costs like estate security, power and cleaning. It is usually paid yearly with the rent."],
  [/scam|fake|fraud|safe/, "Look for the green 'Verified' badge, which means we inspected the property and checked the agent's ID and documents. Keep all chats on U-properties, never pay before a viewing, and report anything suspicious."],
];

export function answer(q: string): string | null {
  const s = q.toLowerCase();
  return FAQ.find(([re]) => re.test(s))?.[1] ?? null;
}

/** AI listing writer: turns an agent's notes into a clean listing description. */
export function writeListing(p: { type: ListingType; beds?: number; area: string; features: string; notes: string }) {
  const kind = p.type === "land" ? "plot" : p.beds ? `${p.beds} bedroom property` : "property";
  const feats = p.features.split(",").map((x) => x.trim()).filter(Boolean);
  return [
    `${p.type === "shortlet" ? "Comfortable" : "Well-located"} ${kind} in ${p.area || "Lagos"}.`,
    feats.length ? `Highlights: ${feats.join(", ")}.` : "",
    p.notes.trim() ? p.notes.trim().replace(/^./, (c) => c.toUpperCase()).replace(/([^.])$/, "$1.") : "",
    "All fees are shown below. No other charges apply, and viewings are free.",
  ].filter(Boolean).join(" ");
}
