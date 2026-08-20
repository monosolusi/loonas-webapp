import { describe, expect, it } from "vitest";
import { SELECT_FIELD_COPY } from "@/app/(user)/onboarding/_utils/select-field-copy";

/** Every string leaf in the copy tree, as `path` → `value` pairs, so a failure names the offender. */
function copyEntries(node: unknown, path: string[] = []): Array<[string, unknown]> {
  if (typeof node !== "object" || node === null) return [[path.join("."), node]];
  return Object.entries(node).flatMap(([key, value]) => copyEntries(value, [...path, key]));
}

describe("SELECT_FIELD_COPY", () => {
  it("has no empty or whitespace-only entry, anywhere in the tree", () => {
    // The reason this module exists. These strings used to live in the five `.tsx` wrappers, out of
    // reach of this node-env suite, so `""` type-checked and rendered as an inert field with no
    // explanation — F10 all over again. Walking the tree means a newly added entry is covered
    // automatically rather than only if someone remembers to assert it.
    for (const [path, value] of copyEntries(SELECT_FIELD_COPY)) {
      expect(typeof value, path).toBe("string");
      expect((value as string).trim().length, path).toBeGreaterThan(0);
    }
  });

  it("covers all five option lists and all three parent-gated fields", () => {
    expect(Object.keys(SELECT_FIELD_COPY.fetchError).sort()).toEqual([
      "city",
      "district",
      "occupation",
      "province",
      "subdistrict",
    ]);
    // Province and occupation top their own chains, so they have no parent hint.
    expect(Object.keys(SELECT_FIELD_COPY.parentHint).sort()).toEqual(["city", "district", "subdistrict"]);
  });

  it("ends every fetch-error string with a period and no parent hint with one", () => {
    for (const copy of Object.values(SELECT_FIELD_COPY.fetchError)) expect(copy.endsWith(".")).toBe(true);
    for (const copy of Object.values(SELECT_FIELD_COPY.parentHint)) expect(copy.endsWith(".")).toBe(false);
  });

  it("keeps the retry label in sentence case, the inline-text-button form in this repo", () => {
    expect(SELECT_FIELD_COPY.retry).toBe("Coba lagi");
  });
});
