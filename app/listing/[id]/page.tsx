"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useRef, useState } from "react";
import { PHONE_LINE, PHONE_LINE_TEL, TYPE_LABEL, agentById } from "@/lib/data.ts";
import { moveInCost, naira, priceLabel } from "@/lib/money.ts";
import { allListings, newId, send, update, useStore } from "@/lib/store.ts";
import { BadgeChip, Photo } from "@/components/ListingCard.tsx";

export default function ListingPage() {
  const { id } = useParams<{ id: string }>();
  const s = useStore();
  const l = allListings(s).find((x) => x.id === id);
  const [nights, setNights] = useState(2);
  const [text, setText] = useState("");
  const [email, setEmail] = useState({ from: "", body: "" });
  const [panel, setPanel] = useState<"chat" | "email" | "call">("chat");
  const reportRef = useRef<HTMLDialogElement>(null);
  const [reported, setReported] = useState(false);

  if (!l) return <div className="wrap section"><h1>Listing not found</h1><Link href="/search">Back to search</Link></div>;
  const agent = agentById(l.agentId);
  const { lines, total } = moveInCost(l, nights);
  const thread = s.threads[l.id] ?? [];

  return (
    <div className="wrap section">
      <p className="small"><Link href={`/search?type=${l.type}`}>← {TYPE_LABEL[l.type]}</Link> · Ref {l.id}</p>
      <div className="detail">
        <div>
          <Photo l={l} big />
          <h1 style={{ marginTop: 16 }}>{l.title}</h1>
          <p className="muted">{l.address}</p>
          <p style={{ fontSize: 24, fontWeight: 700, margin: "8px 0" }}>{priceLabel(l)}</p>
          <p>
            {l.beds ? `${l.beds} bedrooms · ${l.baths} bathrooms` : ""}
            {l.plotSqm ? `${l.plotSqm.toLocaleString()} sqm plot` : ""}
            {l.titleDoc ? ` · Title: ${l.titleDoc}` : ""}
          </p>
          <p>{l.description}</p>
          <ul className="list-check">{l.features.map((x) => <li key={x}>{x}</li>)}</ul>

          <h2 style={{ marginTop: 28 }}>What it costs to {l.type === "rent" ? "move in" : l.type === "shortlet" ? "stay" : "buy"}</h2>
          <div className="card pad">
            {l.type === "shortlet" && (
              <div className="field" style={{ maxWidth: 180 }}>
                <label htmlFor="nights">Nights</label>
                <input id="nights" type="number" min={1} value={nights} onChange={(e) => setNights(Math.max(1, +e.target.value || 1))} />
              </div>
            )}
            <table className="costs"><tbody>
              {lines.map((x) => <tr key={x.label}><td>{x.label}</td><td>{naira(x.amount)}</td></tr>)}
              <tr className="total"><td>Total</td><td>{naira(total)}</td></tr>
            </tbody></table>
            <p className="notice" style={{ marginTop: 12 }}>Fees are moderated by U-properties and capped. <strong>No extra fees.</strong> If anyone asks for money not listed here, or for an inspection fee, report it.</p>
          </div>

          <h2 style={{ marginTop: 28 }}>Checks done <BadgeChip badge={l.badge} /></h2>
          <div className="card pad">
            <ul className="list-check">
              <li>{agent?.registered ? "Registered estate surveyor (NIESV)" : "Lister ID checked (NIN + selfie)"}</li>
              {l.docs.map((d) => <li key={d}>{d}{l.badge === "pending" ? " (being reviewed)" : ""}</li>)}
              {l.badge === "verified" && <li>Site visit by a U-properties inspector</li>}
            </ul>
            {l.badge !== "verified" && <p className="notice warn" style={{ marginTop: 12 }}>This property has not been visited by our inspector yet.</p>}
          </div>
        </div>

        <aside className="card pad sticky" aria-label="Contact">
          <strong>{agent?.name}</strong>
          <div className="muted small">{agent?.company}{agent?.registered ? " · NIESV registered" : ""}</div>
          <div className="row" style={{ margin: "14px 0", gap: 6 }} role="tablist">
            {(["chat", "email", "call"] as const).map((p) => (
              <button key={p} role="tab" aria-selected={panel === p} className={`btn ${panel === p ? "" : "ghost"}`} style={{ padding: "8px 6px", flex: "1 1 0" }} onClick={() => setPanel(p)}>
                {p === "chat" ? "Chat" : p === "email" ? "Email" : "Call"}
              </button>
            ))}
          </div>

          {panel === "chat" && <>
            <div className="chat" aria-live="polite">
              {thread.length === 0 && <p className="muted small">Ask about the property or book a free viewing.</p>}
              {thread.map((m, i) => <div key={i} className={`bubble ${m.from}`}>{m.channel !== "chat" && <span className="tag">{m.channel === "email" ? "Email sent" : "Call logged"}</span>}{m.text}</div>)}
            </div>
            <form className="chatbox" onSubmit={(e) => { e.preventDefault(); if (text.trim()) { send(l.id, text.trim(), "chat"); setText(""); } }}>
              <label htmlFor="msg" className="sr-only">Message</label>
              <input id="msg" value={text} onChange={(e) => setText(e.target.value)} placeholder="Is this still available?" />
              <button className="btn">Send</button>
            </form>
          </>}

          {panel === "email" && (
            <form onSubmit={(e) => { e.preventDefault(); send(l.id, `Email from ${email.from}: ${email.body}`, "email"); setEmail({ from: "", body: "" }); setPanel("chat"); }}>
              <p className="small muted">Sent through U-properties, so the agent sees which listing you mean, and you have a record.</p>
              <div className="field"><label htmlFor="em">Your email</label><input id="em" type="email" required value={email.from} onChange={(e) => setEmail({ ...email, from: e.target.value })} /></div>
              <div className="field"><label htmlFor="eb">Message</label><textarea id="eb" required value={email.body} onChange={(e) => setEmail({ ...email, body: e.target.value })} placeholder={`Hello, I'm interested in ${l.title} (${l.id}).`} /></div>
              <button className="btn block">Send email</button>
            </form>
          )}

          {panel === "call" && <div>
            <p className="small">Call the registered U-properties line. Enter the agent's extension when asked. Neither of you sees the other's number.</p>
            <p style={{ fontSize: 20, fontWeight: 700, margin: "6px 0" }}>{PHONE_LINE}</p>
            <p>Extension <strong>{agent?.ext}</strong> · Ref {l.id}</p>
            <a className="btn block" href={`tel:${PHONE_LINE_TEL},,${agent?.ext}`} onClick={() => send(l.id, `Called the U-properties line about ${l.id}.`, "call")}>Call now</a>
            <p className="small muted">Calls may be recorded to protect you from scams.</p>
          </div>}

          <hr style={{ border: 0, borderTop: "1px solid var(--line)", margin: "16px 0" }} />
          <div className="row" style={{ gap: 6 }}>
            <button className="btn secondary" onClick={() => update((st) => ({ ...st, saved: st.saved.includes(l.id) ? st.saved.filter((x) => x !== l.id) : [...st.saved, l.id] }))}>
              {s.saved.includes(l.id) ? "Saved ✓" : "Save"}
            </button>
            <button className="btn ghost" onClick={() => reportRef.current?.showModal()}>{reported ? "Reported" : "Report listing"}</button>
          </div>
        </aside>
      </div>

      <dialog ref={reportRef} aria-labelledby="rep-title">
        <form method="dialog" onSubmit={(e) => {
          const fd = new FormData(e.currentTarget);
          update((st) => ({ ...st, reports: [...st.reports, { id: newId("R"), listingId: l.id, reason: String(fd.get("reason")), detail: String(fd.get("detail")), status: "open", at: Date.now() }] }));
          setReported(true);
        }}>
          <h2 id="rep-title">Report this listing</h2>
          <div className="field"><label htmlFor="reason">What happened?</label>
            <select id="reason" name="reason" required>
              <option>Asked for an inspection fee or money before viewing</option>
              <option>Asked for fees not shown on the listing</option>
              <option>Property doesn't exist or isn't available</option>
              <option>Photos or details are wrong</option>
              <option>Other</option>
            </select></div>
          <div className="field"><label htmlFor="detail">Details</label><textarea id="detail" name="detail" /></div>
          <div className="row"><button className="btn danger">Send report</button><button type="button" className="btn ghost" onClick={() => reportRef.current?.close()}>Cancel</button></div>
        </form>
      </dialog>
    </div>
  );
}
