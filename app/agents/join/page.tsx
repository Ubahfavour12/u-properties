"use client";
import Link from "next/link";
import { useState } from "react";
import { newId, update } from "@/lib/store.ts";

const STEPS = ["Your details", "ID check", "Documents", "Submitted"];

export default function Join() {
  const [step, setStep] = useState(0);
  const [d, setD] = useState({ role: "agent" as "agent" | "landlord", name: "", company: "", email: "", phone: "", nin: "", cac: "", niesv: "" });
  const [selfie, setSelfie] = useState(false);
  const [docs, setDocs] = useState<string[]>([]);
  const set = (k: keyof typeof d) => (e: { target: { value: string } }) => setD({ ...d, [k]: e.target.value });

  const submit = () => {
    update((s) => ({ ...s, applications: [...s.applications, { id: newId("APP"), ...d, selfie, docs, status: "pending", at: Date.now() }] }));
    setStep(3);
  };

  return (
    <div className="wrap section" style={{ maxWidth: 640 }}>
      <h1>Join U-properties</h1>
      <p className="muted">Free during launch. Verified agents and landlords get more enquiries.</p>
      <div className="steps" aria-label="Progress">{STEPS.map((x, i) => <span key={x} className={i === step ? "on" : ""} aria-current={i === step ? "step" : undefined}>{i + 1}. {x}</span>)}</div>

      <div className="card pad">
        {step === 0 && <form onSubmit={(e) => { e.preventDefault(); setStep(1); }}>
          <div className="field"><label htmlFor="role">I am</label>
            <select id="role" value={d.role} onChange={set("role")}><option value="agent">An agent / agency</option><option value="landlord">A landlord / owner</option></select></div>
          <div className="field"><label htmlFor="name">Full name</label><input id="name" required value={d.name} onChange={set("name")} /></div>
          {d.role === "agent" && <div className="field"><label htmlFor="company">Agency name</label><input id="company" required value={d.company} onChange={set("company")} /></div>}
          <div className="row">
            <div className="field"><label htmlFor="email">Email</label><input id="email" type="email" required value={d.email} onChange={set("email")} /></div>
            <div className="field"><label htmlFor="phone">Phone (kept private)</label><input id="phone" type="tel" required value={d.phone} onChange={set("phone")} /></div>
          </div>
          <button className="btn">Continue</button>
        </form>}

        {step === 1 && <form onSubmit={(e) => { e.preventDefault(); setStep(2); }}>
          <div className="field"><label htmlFor="nin">NIN (11 digits)</label>
            <input id="nin" required inputMode="numeric" pattern="\d{11}" title="11 digits" value={d.nin} onChange={set("nin")} /></div>
          {d.role === "agent" && <div className="row">
            <div className="field"><label htmlFor="cac">CAC number</label><input id="cac" required placeholder="RC or BN number" value={d.cac} onChange={set("cac")} /></div>
            <div className="field"><label htmlFor="niesv">NIESV / ESVARBON no. (optional)</label><input id="niesv" value={d.niesv} onChange={set("niesv")} /></div>
          </div>}
          <div className="field"><label htmlFor="selfie">Selfie (liveness check)</label>
            <input id="selfie" type="file" accept="image/*" capture="user" required onChange={(e) => setSelfie(!!e.target.files?.length)} /></div>
          <p className="small muted">We check your NIN and selfie with a licensed identity provider. Your data is protected under the Nigeria Data Protection Act.</p>
          <div className="row"><button type="button" className="btn ghost" onClick={() => setStep(0)}>Back</button><button className="btn" disabled={!selfie}>Continue</button></div>
        </form>}

        {step === 2 && <form onSubmit={(e) => { e.preventDefault(); submit(); }}>
          <div className="field"><label htmlFor="docs">{d.role === "agent" ? "CAC certificate and any professional licence" : "Proof of ownership (title, deed or receipt)"}</label>
            <input id="docs" type="file" multiple accept="image/*,.pdf" required onChange={(e) => setDocs([...(e.target.files ?? [])].map((f) => f.name))} /></div>
          <p className="small muted">Documents are scanned by AI and reviewed by our team, usually within 48 hours.</p>
          <label className="small" style={{ display: "flex", gap: 8, marginBottom: 14 }}>
            <input type="checkbox" required style={{ width: "auto" }} /> I agree to the U-properties rules: no fees before viewing and no charges outside the listed fees.
          </label>
          <div className="row"><button type="button" className="btn ghost" onClick={() => setStep(1)}>Back</button><button className="btn">Submit for review</button></div>
        </form>}

        {step === 3 && <div>
          <h2>Thanks, {d.name.split(" ")[0]}!</h2>
          <p>Your application is in review. We'll email {d.email} when you're verified. Meanwhile you can prepare your first listing.</p>
          <Link className="btn" href="/agents/list">List a property</Link>
        </div>}
      </div>
    </div>
  );
}
