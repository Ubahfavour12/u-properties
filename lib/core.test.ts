import test from "node:test";
import assert from "node:assert/strict";
import { LISTINGS } from "./data.ts";
import { moveInCost, feeProblems } from "./money.ts";
import { parseQuery, matches, answer } from "./assistant.ts";

test("move-in cost adds rent x years and every fee", () => {
  const l = LISTINGS.find((x) => x.id === "UP-1005")!; // 2 years upfront
  const { total, lines } = moveInCost(l);
  assert.equal(lines[0].amount, 90_000_000);
  assert.equal(total, 90_000_000 + 4_500_000 + 4_500_000 + 3_000_000 + 5_000_000);
});

test("short-let cost is nights x price + caution", () => {
  const l = LISTINGS.find((x) => x.id === "UP-4001")!;
  assert.equal(moveInCost(l, 3).total, 65_000 * 3 + 50_000);
});

test("fee caps flag fees above 10%", () => {
  assert.deepEqual(feeProblems({ type: "rent", price: 1_000_000, fees: { agency: 100_000, legal: 100_000 } }), []);
  assert.equal(feeProblems({ type: "rent", price: 1_000_000, fees: { agency: 200_000 } }).length, 1);
  assert.deepEqual(feeProblems({ type: "shortlet", price: 50_000, fees: { caution: 90_000 } }), []);
});

test("all demo listings respect the fee caps", () => {
  for (const l of LISTINGS) assert.deepEqual(feeProblems(l), [], l.id);
});

test("assistant parses plain-English searches", () => {
  assert.deepEqual(parseQuery("2-bed in Lekki under ₦7m a year"), { area: "Lekki Phase 1", maxPrice: 7e6, beds: 2 });
  assert.equal(parseQuery("land in Ibeju-Lekki").type, "land");
  assert.equal(parseQuery("land in Ibeju-Lekki").area, "Ibeju-Lekki");
  assert.equal(parseQuery("shortlet in VI for 2 nights").type, "shortlet");
  assert.equal(parseQuery("shortlet in VI for 2 nights").area, "Victoria Island");
  assert.equal(parseQuery("self contain in Yaba below 1.5m").maxPrice, 1.5e6);
  const hits = LISTINGS.filter((l) => matches(l, parseQuery("2 bedroom flat to rent in Lekki under 7m")));
  assert.deepEqual(hits.map((h) => h.id), ["UP-1001"]);
});

test("assistant answers property questions", () => {
  assert.match(answer("what is a C of O?")!, /Certificate of Occupancy/);
  assert.match(answer("agent wants inspection fee")!, /Never pay/);
  assert.equal(answer("hello"), null);
});
