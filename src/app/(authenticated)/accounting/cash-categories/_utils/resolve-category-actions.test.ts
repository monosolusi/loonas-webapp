import { describe, expect, it } from "vitest";
import { resolveCategoryActions } from "@/app/(authenticated)/accounting/cash-categories/_utils/resolve-category-actions";

describe("resolveCategoryActions", () => {
  it("gives a curated category no menu at all", () => {
    expect(resolveCategoryActions(true)).toEqual({ hasMenu: false });
  });

  it("gives a merchant-created category an edit and a delete option", () => {
    const result = resolveCategoryActions(false);

    expect(result).toEqual({
      hasMenu: true,
      options: [
        { kind: "edit", label: "Ubah", variant: "default" },
        { kind: "delete", label: "Hapus", variant: "danger" },
      ],
    });
  });

  it("orders edit before delete for a merchant-created category", () => {
    const result = resolveCategoryActions(false);

    if (!result.hasMenu) throw new Error("expected a menu");
    expect(result.options.map((option) => option.kind)).toEqual(["edit", "delete"]);
  });

  it("marks only delete as a destructive option", () => {
    const result = resolveCategoryActions(false);

    if (!result.hasMenu) throw new Error("expected a menu");
    expect(result.options.map((option) => option.variant)).toEqual(["default", "danger"]);
  });
});
