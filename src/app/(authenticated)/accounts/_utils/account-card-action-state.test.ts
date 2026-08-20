import { describe, expect, it } from "vitest";
import {
  AccountCardActionState,
  resolveAccountCardAction,
} from "@/app/(authenticated)/accounts/_utils/account-card-action-state";

/** Only "current" is a status label, not a block — every other action must stay clickable. */
const NON_INTERACTIVE_ACTIONS: ReadonlySet<AccountCardActionState> = new Set(["current"]);

describe("resolveAccountCardAction", () => {
  it("resolves to \"current\" when the card is the active account, regardless of approval", () => {
    expect(resolveAccountCardAction({ isCurrent: true, isApproved: true })).toBe("current");
    expect(resolveAccountCardAction({ isCurrent: true, isApproved: false })).toBe("current");
  });

  it("resolves to \"enter-dashboard\" for an approved, non-active account", () => {
    expect(resolveAccountCardAction({ isCurrent: false, isApproved: true })).toBe("enter-dashboard");
  });

  it("resolves to \"view-verification\" for a pending or rejected, non-active account", () => {
    expect(resolveAccountCardAction({ isCurrent: false, isApproved: false })).toBe("view-verification");
  });

  describe("invariant: no input yields a disabled action other than \"current\"", () => {
    const matrix = [
      { isCurrent: true, isApproved: true },
      { isCurrent: true, isApproved: false },
      { isCurrent: false, isApproved: true },
      { isCurrent: false, isApproved: false },
    ];

    it.each(matrix)("params=%o", (params) => {
      const result = resolveAccountCardAction(params);

      if (NON_INTERACTIVE_ACTIONS.has(result)) {
        expect(result).toBe("current");
      } else {
        expect(result === "enter-dashboard" || result === "view-verification").toBe(true);
      }
    });
  });
});
