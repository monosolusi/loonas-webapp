import { describe, expect, it } from "vitest";
import {
  NATIONALITY_OPTIONS,
  UNAVAILABLE_NATIONALITY_CHIP_LABEL,
  isNationalitySelectable,
} from "@/app/(user)/onboarding/account/_utils/nationality-options";

describe("NATIONALITY_OPTIONS — the F10 invariant", () => {
  it("never offers an unselectable option without a reason the user can read", () => {
    // The whole point of the module. QA finding F10 was a WNA card that was inert with nothing on
    // screen explaining why — no message, no chip, only `opacity-50`. The `NationalityAvailability`
    // union makes a missing `reason` a type error; this guards the COPY, which the type cannot:
    // an empty or whitespace-only string would type-check and still render an empty card.
    for (const option of NATIONALITY_OPTIONS) {
      if (option.availability.selectable) continue;
      expect(option.availability.reason.trim().length).toBeGreaterThan(0);
    }
  });

  it("keeps at least one option selectable, so the field is never a dead end", () => {
    // If this ever went false the citizenship step could not be completed at all, and every card
    // would explain itself while leaving the user with no way to proceed.
    expect(NATIONALITY_OPTIONS.some((option) => option.availability.selectable)).toBe(true);
  });

  it("carries a chip label for the unselectable state", () => {
    expect(UNAVAILABLE_NATIONALITY_CHIP_LABEL.trim().length).toBeGreaterThan(0);
  });
});

describe("NATIONALITY_OPTIONS — the catalogue as it stands today", () => {
  it("offers exactly WNI and WNA, in that order", () => {
    expect(NATIONALITY_OPTIONS.map((option) => option.value)).toEqual(["WNI", "WNA"]);
  });

  it("makes WNI selectable and WNA not", () => {
    expect(isNationalitySelectable("WNI")).toBe(true);
    expect(isNationalitySelectable("WNA")).toBe(false);
  });

  it("gives every option the icons and copy the card renders", () => {
    for (const option of NATIONALITY_OPTIONS) {
      expect(option.title.trim().length).toBeGreaterThan(0);
      expect(option.description.trim().length).toBeGreaterThan(0);
      expect(option.uncheckedIconPath).toMatch(/^\/assets\/images\/.+\.svg$/);
      expect(option.checkedIconPath).toMatch(/^\/assets\/images\/.+\.svg$/);
    }
  });
});

describe("isNationalitySelectable", () => {
  it("agrees with the catalogue for every option, so there is one owner of the predicate", () => {
    // Guards against the drift CLAUDE.md warns about (LNS-608): an exported predicate that sits
    // beside a consumer re-deriving the same rule from the underlying field.
    for (const option of NATIONALITY_OPTIONS) {
      expect(isNationalitySelectable(option.value)).toBe(option.availability.selectable);
    }
  });
});
