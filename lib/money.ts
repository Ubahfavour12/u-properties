import type { Listing } from "./data.ts";

// Fee caps U-properties enforces. Agents may not charge anything not listed.
// shortcut: 10% caps are a placeholder policy, confirm the final numbers before launch.
export const FEE_CAPS = { agencyPct: 10, legalPct: 10 };

export const naira = (n: number) => "₦" + Math.round(n).toLocaleString("en-NG");

export const shortNaira = (n: number) =>
  n >= 1e9 ? `₦${+(n / 1e9).toFixed(1)}bn` : n >= 1e6 ? `₦${+(n / 1e6).toFixed(1)}m` : n >= 1e3 ? `₦${+(n / 1e3).toFixed(0)}k` : naira(n);

export const priceLabel = (l: Listing) =>
  l.type === "rent" ? `${naira(l.price)} / year` : l.type === "shortlet" ? `${naira(l.price)} / night` : naira(l.price);

// Base the fee % is measured against: one year's rent, or the sale price.
const feeBase = (l: Listing) => (l.type === "shortlet" ? 0 : l.price);

/** Every naira the renter/buyer pays to move in. Nothing outside this list is allowed. */
export function moveInCost(l: Listing, nights = 2) {
  const lines: { label: string; amount: number }[] = [];
  if (l.type === "rent") lines.push({ label: `Rent (${l.yearsUpfront ?? 1} year${(l.yearsUpfront ?? 1) > 1 ? "s" : ""} upfront)`, amount: l.price * (l.yearsUpfront ?? 1) });
  else if (l.type === "shortlet") lines.push({ label: `${nights} nights`, amount: l.price * nights });
  else lines.push({ label: "Price", amount: l.price });
  const f = l.fees;
  if (f.agency) lines.push({ label: "Agency fee", amount: f.agency });
  if (f.legal) lines.push({ label: "Legal fee", amount: f.legal });
  if (f.caution) lines.push({ label: "Caution deposit (refundable)", amount: f.caution });
  if (f.service) lines.push({ label: "Service charge (1 year)", amount: f.service });
  return { lines, total: lines.reduce((s, x) => s + x.amount, 0) };
}

/** Problems with a listing's fees under the U-properties fee policy. Empty = OK. */
export function feeProblems(l: Pick<Listing, "type" | "price" | "fees">): string[] {
  const base = feeBase(l as Listing);
  const out: string[] = [];
  if (!base) return out;
  if ((l.fees.agency ?? 0) > (base * FEE_CAPS.agencyPct) / 100) out.push(`Agency fee is above ${FEE_CAPS.agencyPct}% of the ${l.type === "rent" ? "yearly rent" : "price"}.`);
  if ((l.fees.legal ?? 0) > (base * FEE_CAPS.legalPct) / 100) out.push(`Legal fee is above ${FEE_CAPS.legalPct}% of the ${l.type === "rent" ? "yearly rent" : "price"}.`);
  return out;
}
