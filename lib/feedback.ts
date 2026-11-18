// Where feedback is sent. The publishable key is safe in the browser: the database only lets it insert feedback.
// shortcut: hard-coded because Vercel env vars can't be set from here; move to NEXT_PUBLIC_ env vars later.
// Parked in the marketing-platform Supabase project (table up_feedback) until U-properties gets its own.
export const SUPABASE_URL = "https://uobvfnkfdykercojmnbu.supabase.co";
export const SUPABASE_KEY = "sb_publishable_rMpVnQ-1y5xhTf9WKTP1QA_MyArCQZD";

export const ROLES = ["renter", "buyer", "agent", "landlord", "investor", "other"] as const;
export type Role = (typeof ROLES)[number];
export type Feedback = { rating?: number; message: string; role?: Role; name?: string; contact?: string; page: string };

/** Trims and checks a submission before it leaves the browser. Returns an error message, or the clean row. */
export function cleanFeedback(f: Feedback): { error: string } | { row: Feedback } {
  const message = f.message.trim();
  if (!message) return { error: "Please write a comment." };
  if (message.length > 2000) return { error: "Please keep it under 2,000 characters." };
  if (f.rating !== undefined && !(Number.isInteger(f.rating) && f.rating >= 1 && f.rating <= 5)) return { error: "Rating must be 1 to 5." };
  if (f.role && !ROLES.includes(f.role)) return { error: "Unknown role." };
  return { row: {
    message,
    rating: f.rating,
    role: f.role || undefined,
    name: f.name?.trim().slice(0, 100) || undefined,
    contact: f.contact?.trim().slice(0, 200) || undefined,
    page: f.page.slice(0, 300),
  } };
}

export async function sendFeedback(row: Feedback) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/up_feedback`, {
    method: "POST",
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, "Content-Type": "application/json", Prefer: "return=minimal" },
    body: JSON.stringify(row),
  });
  if (!res.ok) throw new Error(`Feedback failed (${res.status})`);
}
