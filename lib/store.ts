"use client";
// shortcut: state lives in the browser (localStorage) so the MVP needs no server; move to a database (e.g. Supabase) before real users.
import { useSyncExternalStore } from "react";
import { LISTINGS, type Listing } from "./data.ts";

export type Channel = "chat" | "email" | "call";
export type Message = { from: "me" | "agent"; text: string; at: number; channel: Channel };
export type Application = {
  id: string; role: "agent" | "landlord"; name: string; company: string; email: string; phone: string;
  nin: string; cac?: string; niesv?: string; selfie: boolean; docs: string[]; status: "pending" | "approved" | "rejected"; at: number;
};
export type Submitted = Listing & { status: "pending" | "approved" | "rejected"; uploaded: string[]; at: number };
export type Report = { id: string; listingId: string; reason: string; detail: string; status: "open" | "closed"; at: number };

type State = {
  threads: Record<string, Message[]>;
  saved: string[];
  applications: Application[];
  submitted: Submitted[];
  reports: Report[];
};

const KEY = "u-properties-v1";
const EMPTY: State = { threads: {}, saved: [], applications: [], submitted: [], reports: [] };
let state: State = EMPTY;
let loaded = false;
const subs = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try { state = { ...EMPTY, ...JSON.parse(localStorage.getItem(KEY) ?? "{}") }; } catch { state = EMPTY; }
}

export function update(fn: (s: State) => State) {
  load();
  state = fn(state);
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* private mode: keep in memory */ }
  subs.forEach((f) => f());
}

const subscribe = (f: () => void) => { subs.add(f); return () => subs.delete(f); };
const get = () => { load(); return state; };

export const useStore = () => useSyncExternalStore(subscribe, get, () => EMPTY);

export const newId = (p: string) => `${p}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}`;

/** Demo listings plus agent listings approved in the admin queue. */
export const allListings = (s: State): Listing[] => [...s.submitted.filter((x) => x.status === "approved"), ...LISTINGS];

export function send(listingId: string, text: string, channel: Channel) {
  update((s) => ({ ...s, threads: { ...s.threads, [listingId]: [...(s.threads[listingId] ?? []), { from: "me", text, at: Date.now(), channel }] } }));
  // Demo auto-reply so the chat feels live.
  setTimeout(() => update((s) => ({
    ...s,
    threads: { ...s.threads, [listingId]: [...(s.threads[listingId] ?? []), {
      from: "agent", at: Date.now(), channel: "chat",
      text: channel === "email" ? "Thanks for your email. I've replied to your inbox too. When would you like to view?" :
        channel === "call" ? "Thanks for calling through U-properties. Let's confirm a viewing time here." :
        "Thanks for your message! The property is available. Viewings are free. When suits you?",
    }] },
  })), 1200);
}
