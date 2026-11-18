"use client";
import Link from "next/link";
import { LISTINGS } from "@/lib/data.ts";
import { naira } from "@/lib/money.ts";
import { update, useStore } from "@/lib/store.ts";

// shortcut: no login on the admin page in the MVP; add staff accounts before real data goes in.
export default function Admin() {
  const s = useStore();
  const setApp = (id: string, status: "approved" | "rejected") => update((st) => ({ ...st, applications: st.applications.map((a) => a.id === id ? { ...a, status } : a) }));
  const setListing = (id: string, status: "approved" | "rejected") => update((st) => ({ ...st, submitted: st.submitted.map((l) => l.id === id ? { ...l, status } : l) }));
  const closeReport = (id: string) => update((st) => ({ ...st, reports: st.reports.map((r) => r.id === id ? { ...r, status: "closed" } : r) }));
  const pendingApps = s.applications.filter((a) => a.status === "pending");
  const pendingListings = s.submitted.filter((l) => l.status === "pending");
  const openReports = s.reports.filter((r) => r.status === "open");
  const title = (id: string) => [...s.submitted, ...LISTINGS].find((l) => l.id === id)?.title ?? id;

  return (
    <div className="wrap section">
      <h1>Verification queue</h1>
      <p className="muted">Agents waiting {pendingApps.length} · Listings waiting {pendingListings.length} · Open reports {openReports.length}</p>

      <h2 style={{ marginTop: 24 }}>Agent and landlord applications</h2>
      <div className="card" style={{ overflowX: "auto" }}>
        {pendingApps.length === 0 ? <p className="pad muted" style={{ padding: 16 }}>Nothing waiting.</p> :
          <table className="table"><thead><tr><th>Name</th><th>ID checks</th><th>Documents</th><th></th></tr></thead><tbody>
            {pendingApps.map((a) => <tr key={a.id}>
              <td><strong>{a.name}</strong><div className="muted">{a.role}{a.company ? ` · ${a.company}` : ""}<br />{a.email}</div></td>
              <td>NIN {a.nin.replace(/\d(?=\d{4})/g, "•")}<br />Selfie {a.selfie ? "✓" : "missing"}{a.cac && <><br />CAC {a.cac}</>}{a.niesv && <><br />NIESV {a.niesv}</>}</td>
              <td>{a.docs.join(", ")}</td>
              <td><div className="row" style={{ gap: 6 }}><button className="btn" onClick={() => setApp(a.id, "approved")}>Approve</button><button className="btn ghost" onClick={() => setApp(a.id, "rejected")}>Reject</button></div></td>
            </tr>)}
          </tbody></table>}
      </div>

      <h2 style={{ marginTop: 24 }}>New listings</h2>
      <div className="card" style={{ overflowX: "auto" }}>
        {pendingListings.length === 0 ? <p className="muted" style={{ padding: 16 }}>Nothing waiting.</p> :
          <table className="table"><thead><tr><th>Listing</th><th>Price and fees</th><th>Documents</th><th></th></tr></thead><tbody>
            {pendingListings.map((l) => <tr key={l.id}>
              <td><strong>{l.title}</strong><div className="muted">{l.type} · {l.address}, {l.area}</div></td>
              <td>{naira(l.price)}<div className="muted">{Object.entries(l.fees).filter(([, v]) => v).map(([k, v]) => `${k} ${naira(v!)}`).join(" · ")}</div></td>
              <td>{l.uploaded.join(", ")}</td>
              <td><div className="row" style={{ gap: 6 }}><button className="btn" onClick={() => setListing(l.id, "approved")}>Approve</button><button className="btn ghost" onClick={() => setListing(l.id, "rejected")}>Reject</button></div></td>
            </tr>)}
          </tbody></table>}
      </div>

      <h2 style={{ marginTop: 24 }}>Scam reports</h2>
      <div className="card" style={{ overflowX: "auto" }}>
        {openReports.length === 0 ? <p className="muted" style={{ padding: 16 }}>No open reports.</p> :
          <table className="table"><thead><tr><th>Listing</th><th>Reason</th><th></th></tr></thead><tbody>
            {openReports.map((r) => <tr key={r.id}>
              <td><Link href={`/listing/${r.listingId}`}>{title(r.listingId)}</Link></td>
              <td>{r.reason}<div className="muted">{r.detail}</div></td>
              <td><button className="btn ghost" onClick={() => closeReport(r.id)}>Mark handled</button></td>
            </tr>)}
          </tbody></table>}
      </div>
    </div>
  );
}
