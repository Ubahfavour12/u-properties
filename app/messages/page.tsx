"use client";
import Link from "next/link";
import { allListings, useStore } from "@/lib/store.ts";
import { ListingCard } from "@/components/ListingCard.tsx";

export default function Messages() {
  const s = useStore();
  const listings = allListings(s);
  const ids = Object.keys(s.threads);
  const saved = listings.filter((l) => s.saved.includes(l.id));
  return (
    <div className="wrap section">
      <h1>Messages</h1>
      {ids.length === 0 ? <p className="muted">No conversations yet. Open a listing to chat, email or call the agent.</p> : (
        <div className="card">
          <table className="table"><tbody>
            {ids.map((id) => {
              const l = listings.find((x) => x.id === id);
              const last = s.threads[id].at(-1)!;
              return <tr key={id}>
                <td><Link href={`/listing/${id}`}><strong>{l?.title ?? id}</strong></Link><div className="muted small">{l?.area}</div></td>
                <td className="small">{last.from === "agent" ? "Agent: " : "You: "}{last.text.slice(0, 90)}</td>
                <td className="small muted">{new Date(last.at).toLocaleString("en-NG")}</td>
              </tr>;
            })}
          </tbody></table>
        </div>
      )}
      <h2 style={{ marginTop: 32 }}>Saved properties</h2>
      {saved.length ? <div className="grid">{saved.map((l) => <ListingCard key={l.id} l={l} />)}</div> : <p className="muted">Nothing saved yet.</p>}
    </div>
  );
}
