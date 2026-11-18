"use client";
import { useState } from "react";
import { AREAS, TYPE_LABEL, type ListingType } from "@/lib/data.ts";
import { writeListing } from "@/lib/assistant.ts";
import { FEE_CAPS, feeProblems } from "@/lib/money.ts";
import { newId, update } from "@/lib/store.ts";

const DOCS: Record<ListingType, string> = {
  rent: "Owner's letter of authority, owner's ID, utility bill",
  sale: "Title (C of O / Governor's Consent / Deed), survey plan, building approval, mandate",
  land: "Title, registered survey plan, excision or gazette, mandate",
  shortlet: "Owner's ID, proof of ownership or a lease that allows subletting",
};

export default function ListProperty() {
  const [p, setP] = useState({ type: "rent" as ListingType, title: "", area: AREAS[0], address: "", price: "", years: "1", beds: "", baths: "", plot: "", titleDoc: "", agency: "", legal: "", caution: "", service: "", features: "", notes: "", description: "" });
  const [uploaded, setUploaded] = useState<string[]>([]);
  const [done, setDone] = useState(false);
  const set = (k: keyof typeof p) => (e: { target: { value: string } }) => setP({ ...p, [k]: e.target.value });
  const num = (v: string) => Number(v.replace(/\D/g, "")) || undefined;
  const fees = { agency: num(p.agency), legal: num(p.legal), caution: num(p.caution), service: num(p.service) };
  const problems = feeProblems({ type: p.type, price: num(p.price) ?? 0, fees });
  const land = p.type === "land";

  const submit = () => {
    update((s) => ({ ...s, submitted: [...s.submitted, {
      id: newId("UP"), type: p.type, title: p.title, area: p.area, address: p.address, price: num(p.price)!,
      yearsUpfront: p.type === "rent" ? Number(p.years) : undefined, beds: num(p.beds), baths: num(p.baths), plotSqm: num(p.plot),
      titleDoc: p.titleDoc || undefined, fees, badge: "documents", docs: uploaded, agentId: "a4",
      description: p.description, features: p.features.split(",").map((x) => x.trim()).filter(Boolean),
      hue: Math.floor(Math.random() * 360), status: "pending", uploaded, at: Date.now(),
    }] }));
    setDone(true);
  };

  if (done) return <div className="wrap section" style={{ maxWidth: 640 }}><div className="card pad"><h1>Listing submitted</h1><p>Our team will check the documents and contact you about a site visit. It goes live as "Documents checked" once approved.</p></div></div>;

  return (
    <div className="wrap section" style={{ maxWidth: 760 }}>
      <h1>List a property</h1>
      <p className="muted">Free during launch. Every listing is checked before it goes live.</p>
      <form className="card pad" onSubmit={(e) => { e.preventDefault(); if (!problems.length) submit(); }}>
        <div className="row">
          <div className="field"><label htmlFor="type">Type</label><select id="type" value={p.type} onChange={set("type")}>{Object.entries(TYPE_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></div>
          <div className="field"><label htmlFor="area">Area</label><select id="area" value={p.area} onChange={set("area")}>{AREAS.map((a) => <option key={a}>{a}</option>)}</select></div>
        </div>
        <div className="field"><label htmlFor="title">Headline</label><input id="title" required value={p.title} onChange={set("title")} placeholder={land ? "600 sqm residential plot" : "2 bedroom flat with BQ"} /></div>
        <div className="field"><label htmlFor="address">Address</label><input id="address" required value={p.address} onChange={set("address")} /></div>
        <div className="row">
          <div className="field"><label htmlFor="price">{p.type === "rent" ? "Rent per year (₦)" : p.type === "shortlet" ? "Price per night (₦)" : "Price (₦)"}</label><input id="price" required inputMode="numeric" value={p.price} onChange={set("price")} /></div>
          {p.type === "rent" && <div className="field"><label htmlFor="years">Years upfront</label><select id="years" value={p.years} onChange={set("years")}><option>1</option><option>2</option></select></div>}
        </div>
        <div className="row">
          {land ? <div className="field"><label htmlFor="plot">Plot size (sqm)</label><input id="plot" required inputMode="numeric" value={p.plot} onChange={set("plot")} /></div> : <>
            <div className="field"><label htmlFor="beds">Bedrooms</label><input id="beds" required inputMode="numeric" value={p.beds} onChange={set("beds")} /></div>
            <div className="field"><label htmlFor="baths">Bathrooms</label><input id="baths" required inputMode="numeric" value={p.baths} onChange={set("baths")} /></div></>}
          {(p.type === "sale" || land) && <div className="field"><label htmlFor="titleDoc">Title document</label><select id="titleDoc" required value={p.titleDoc} onChange={set("titleDoc")}><option value="">Choose…</option><option>Certificate of Occupancy</option><option>Governor's Consent</option><option>Deed of Assignment</option><option>Excision</option></select></div>}
        </div>

        <fieldset style={{ border: 0, padding: 0, margin: "8px 0" }}>
          <legend style={{ fontWeight: 700, marginBottom: 6 }}>Fees (₦): the only fees you may charge</legend>
          <div className="row">
            {p.type !== "shortlet" && <>
              <div className="field"><label htmlFor="agency">Agency (max {FEE_CAPS.agencyPct}%)</label><input id="agency" inputMode="numeric" value={p.agency} onChange={set("agency")} /></div>
              <div className="field"><label htmlFor="legal">Legal (max {FEE_CAPS.legalPct}%)</label><input id="legal" inputMode="numeric" value={p.legal} onChange={set("legal")} /></div></>}
            {!land && <div className="field"><label htmlFor="caution">Caution (refundable)</label><input id="caution" inputMode="numeric" value={p.caution} onChange={set("caution")} /></div>}
            {p.type === "rent" && <div className="field"><label htmlFor="service">Service charge / yr</label><input id="service" inputMode="numeric" value={p.service} onChange={set("service")} /></div>}
          </div>
          {problems.length > 0 && <div className="notice warn" role="alert">{problems.map((x) => <div key={x}>{x}</div>)}</div>}
        </fieldset>

        <div className="field"><label htmlFor="features">Features (comma separated)</label><input id="features" value={p.features} onChange={set("features")} placeholder="24h power, gated estate, borehole" /></div>
        <div className="field"><label htmlFor="notes">Your notes</label><textarea id="notes" value={p.notes} onChange={set("notes")} placeholder="close to the lagoon, newly painted, owner wants a family" /></div>
        <button type="button" className="btn secondary" onClick={() => setP({ ...p, description: writeListing({ type: p.type, beds: num(p.beds), area: p.area, features: p.features, notes: p.notes }) })}>✨ Write my description with AI</button>
        <div className="field" style={{ marginTop: 12 }}><label htmlFor="description">Description</label><textarea id="description" required value={p.description} onChange={set("description")} /></div>

        <div className="field"><label htmlFor="docs">Documents to upload</label>
          <p className="small muted" style={{ margin: "0 0 6px" }}>{DOCS[p.type]}</p>
          <input id="docs" type="file" multiple required accept="image/*,.pdf" onChange={(e) => setUploaded([...(e.target.files ?? [])].map((f) => f.name))} /></div>
        <div className="field"><label htmlFor="photos">Photos</label><input id="photos" type="file" multiple accept="image/*" /></div>
        <button className="btn" disabled={problems.length > 0}>Submit for checks</button>
      </form>
    </div>
  );
}
