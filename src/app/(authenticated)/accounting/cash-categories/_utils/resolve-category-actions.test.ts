import { describe, expect, it } from "vitest";
import { resolveCategoryActions } from "@/app/(authenticated)/accounting/cash-categories/_utils/resolve-category-actions";

describe("resolveCategoryActions", () => {
  it("gives a general curated category exactly one edit-account option, no delete", () => {
    const result = resolveCategoryActions({ isCurated: true, isGeneral: true });
    expect(result).toEqual({
      hasMenu: true,
      options: [{ kind: "edit-account", label: "Ubah Akun", variant: "default" }],
    });
  });

  it("gives an ordinary curated category no menu at all", () => {
    expect(resolveCategoryActions({ isCurated: true, isGeneral: false })).toEqual({ hasMenu: false });
  });

  it("gives a merchant-created category an edit and a delete option", () => {
    const result = resolveCategoryActions({ isCurated: false, isGeneral: false });

    expect(result).toEqual({
      hasMenu: true,
      options: [
        { kind: "edit", label: "Ubah", variant: "default" },
        { kind: "delete", label: "Hapus", variant: "danger" },
      ],
    });
  });

  it("orders edit before delete for a merchant-created category", () => {
    const result = resolveCategoryActions({ isCurated: false, isGeneral: false });

    if (!result.hasMenu) throw new Error("expected a menu");
    expect(result.options.map((option) => option.kind)).toEqual(["edit", "delete"]);
  });

  it("marks only delete as a destructive option among the merchant-created category's actions", () => {
    const result = resolveCategoryActions({ isCurated: false, isGeneral: false });

    if (!result.hasMenu) throw new Error("expected a menu");
    expect(result.options.map((option) => option.variant)).toEqual(["default", "danger"]);
  });

  it("never adds a delete option to a general category, even though it is curated", () => {
    const result = resolveCategoryActions({ isCurated: true, isGeneral: true });

    if (!result.hasMenu) throw new Error("expected a menu");
    expect(result.options.some((option) => option.kind === "delete")).toBe(false);
  });
});
