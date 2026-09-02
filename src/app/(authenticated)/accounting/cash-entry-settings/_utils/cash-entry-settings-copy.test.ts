import { describe, expect, it } from "vitest";
import { CashEntryDirection } from "@/features/accounting/domain/enums/cash-entry-direction";
import {
  CASH_ENTRY_SETTINGS_COPY,
  resolveEligibleAccountTypesHint,
} from "@/app/(authenticated)/accounting/cash-entry-settings/_utils/cash-entry-settings-copy";

/** Every string leaf in the copy tree, as `path` → `value` pairs, so a failure names the offender. */
function copyEntries(node: unknown, path: string[] = []): Array<[string, unknown]> {
  if (typeof node !== "object" || node === null) return [[path.join("."), node]];
  return Object.entries(node).flatMap(([key, value]) => copyEntries(value, [...path, key]));
}

describe("CASH_ENTRY_SETTINGS_COPY", () => {
  it("has no empty or whitespace-only entry, anywhere in the tree", () => {
    for (const [path, value] of copyEntries(CASH_ENTRY_SETTINGS_COPY)) {
      expect(typeof value, path).toBe("string");
      expect((value as string).trim().length, path).toBeGreaterThan(0);
    }
  });

  it("describes the fixed cash account, that it cannot change, the offset purpose, and keeps the forward-only sentence", () => {
    const description = CASH_ENTRY_SETTINGS_COPY.defaultAccountCard.description;
    expect(description).toContain("1100");
    expect(description).toContain("tetap dan tidak dapat diubah");
    expect(description).toContain("akun lawan (offset)");
    expect(description).toContain(
      "Perubahan hanya berlaku untuk transaksi berikutnya — transaksi yang sudah tercatat tetap memakai akun lama.",
    );
  });

  it("states the offset fields' purpose without asserting an unverifiable trigger condition", () => {
    const description = CASH_ENTRY_SETTINGS_COPY.defaultAccountCard.description;
    // The live spec contradicts itself on when these defaults actually fire, and `category_id` is
    // required on create — so the copy must never assert a trigger condition it cannot verify. This
    // negative assertion is the point: it stops the unverifiable claim from being re-added silently.
    expect(description).not.toContain("tanpa kategori");
    expect(description).not.toContain("tidak menyertakan kategori");
    expect(description).not.toContain("kategori bawaan");
  });
});

describe("resolveEligibleAccountTypesHint", () => {
  it("names only Pendapatan for cash-in", () => {
    const hint = resolveEligibleAccountTypesHint(CashEntryDirection.In);
    expect(hint).toContain("Pendapatan");
    expect(hint).not.toContain("Beban");
    expect(hint).not.toContain("Aset");
  });

  it("names both Beban and Aset for cash-out", () => {
    const hint = resolveEligibleAccountTypesHint(CashEntryDirection.Out);
    expect(hint).toContain("Beban");
    expect(hint).toContain("Aset");
  });
});
