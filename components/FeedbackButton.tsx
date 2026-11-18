"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { ROLES, SUPABASE_URL, cleanFeedback, sendFeedback, type Role } from "@/lib/feedback.ts";

export function FeedbackButton() {
  const page = usePathname();
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState<number>();
  const [message, setMessage] = useState("");
  const [role, setRole] = useState<Role | "">("");
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  if (!SUPABASE_URL) return null; // not connected to a database yet

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const c = cleanFeedback({ rating, message, role: role || undefined, name, contact, page });
    if ("error" in c) { setError(c.error); return; }
    setStatus("sending"); setError("");
    try {
      await sendFeedback(c.row);
      setStatus("sent"); setMessage(""); setRating(undefined);
    } catch {
      setStatus("error"); setError("Couldn't send. Please check your connection and try again.");
    }
  };

  return (
    <div className="fb">
      {open && (
        <div className="fb-panel card" role="dialog" aria-labelledby="fb-title">
          <div className="fb-head">
            <strong id="fb-title">Tell us what you think</strong>
            <button className="fb-x" aria-label="Close feedback" onClick={() => { setOpen(false); setStatus("idle"); }}>×</button>
          </div>
          {status === "sent" ? (
            <div>
              <p>Thank you! Your comment helps shape U-properties.</p>
              <button className="btn secondary" onClick={() => setStatus("idle")}>Send another</button>
            </div>
          ) : (
            <form onSubmit={submit}>
              <div className="fb-stars" role="radiogroup" aria-label="Rating">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button type="button" key={n} role="radio" aria-checked={rating === n} aria-label={`${n} star${n > 1 ? "s" : ""}`}
                    className={rating && n <= rating ? "on" : ""} onClick={() => setRating(n)}>★</button>
                ))}
              </div>
              <div className="field"><label htmlFor="fb-msg">Your comment</label>
                <textarea id="fb-msg" required maxLength={2000} value={message} onChange={(e) => setMessage(e.target.value)}
                  placeholder="What do you like? What's missing? Would you use this to find a home?" /></div>
              <div className="field"><label htmlFor="fb-role">I am a…</label>
                <select id="fb-role" value={role} onChange={(e) => setRole(e.target.value as Role | "")}>
                  <option value="">Prefer not to say</option>
                  {ROLES.map((r) => <option key={r} value={r}>{r[0].toUpperCase() + r.slice(1)}</option>)}
                </select></div>
              <div className="row">
                <div className="field"><label htmlFor="fb-name">Name (optional)</label><input id="fb-name" maxLength={100} value={name} onChange={(e) => setName(e.target.value)} /></div>
                <div className="field"><label htmlFor="fb-contact">Email or phone (optional)</label><input id="fb-contact" maxLength={200} value={contact} onChange={(e) => setContact(e.target.value)} /></div>
              </div>
              {error && <p className="notice warn" role="alert">{error}</p>}
              <button className="btn block" disabled={status === "sending"}>{status === "sending" ? "Sending…" : "Send feedback"}</button>
            </form>
          )}
        </div>
      )}
      <button className="btn fb-btn" aria-expanded={open} onClick={() => setOpen(!open)}>💬 Feedback</button>
    </div>
  );
}
