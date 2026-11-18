import test from "node:test";
import assert from "node:assert/strict";
import { cleanFeedback } from "./feedback.ts";

test("feedback is trimmed and checked before sending", () => {
  assert.deepEqual(cleanFeedback({ message: "  ", page: "/" }), { error: "Please write a comment." });
  assert.deepEqual(cleanFeedback({ message: "x".repeat(2001), page: "/" }), { error: "Please keep it under 2,000 characters." });
  assert.deepEqual(cleanFeedback({ message: "ok", rating: 6, page: "/" }), { error: "Rating must be 1 to 5." });
  assert.deepEqual(cleanFeedback({ message: "ok", role: "hacker" as never, page: "/" }), { error: "Unknown role." });
  const r = cleanFeedback({ message: " Love it ", rating: 5, role: "agent", name: " Ada ", contact: "", page: "/listing/UP-1001" });
  assert.deepEqual(r, { row: { message: "Love it", rating: 5, role: "agent", name: "Ada", contact: undefined, page: "/listing/UP-1001" } });
});
