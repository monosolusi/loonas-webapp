import { describe, expect, it } from "vitest";
import { BlockingPosting } from "@/features/accounting/domain/entities/blocking-posting";
import {
  deriveBlockingOverheadAccounts,
  hasUnattributedBlockingPosting,
  isNamedOverheadAccountPosting,
} from "@/features/accounting/domain/helpers/blocking-posting";

const OVERHEAD_COLLISION_CODE = "OVERHEAD_ACCOUNT_AUTO_POSTING_REFUSED";

function posting(overrides: Partial<BlockingPosting>): BlockingPosting {
  return { sourceTable: "pos_sales", outboxId: "ob-1", errorCode: null, coaAccount: null, ...overrides };
}

describe("isNamedOverheadAccountPosting", () => {
  it("is true only for the overhead-collision code with a resolved account", () => {
    expect(
      isNamedOverheadAccountPosting(
        posting({ errorCode: OVERHEAD_COLLISION_CODE, coaAccount: { id: "1", code: "5100", name: "Beban Sewa" } }),
      ),
    ).toBe(true);
  });

  it("is false when the account did not resolve, even for the collision code", () => {
    expect(isNamedOverheadAccountPosting(posting({ errorCode: OVERHEAD_COLLISION_CODE, coaAccount: null }))).toBe(false);
  });

  it("is false for an unrelated or null error code", () => {
    expect(
      isNamedOverheadAccountPosting(posting({ errorCode: "SOME_OTHER_CODE", coaAccount: { id: "1", code: "5100", name: "Beban Sewa" } })),
    ).toBe(false);
    expect(isNamedOverheadAccountPosting(posting({ errorCode: null }))).toBe(false);
  });
});

describe("deriveBlockingOverheadAccounts", () => {
  it("dedups by account id across multiple postings", () => {
    const account = { id: "1", code: "5100", name: "Beban Sewa" };
    const accounts = deriveBlockingOverheadAccounts([
      posting({ errorCode: OVERHEAD_COLLISION_CODE, coaAccount: account }),
      posting({ errorCode: OVERHEAD_COLLISION_CODE, coaAccount: account }),
    ]);
    expect(accounts).toEqual([account]);
  });

  it("excludes unattributed and unresolved-account postings", () => {
    const accounts = deriveBlockingOverheadAccounts([
      posting({ errorCode: null }),
      posting({ errorCode: "SOME_OTHER_CODE", coaAccount: { id: "2", code: "5200", name: "Beban Lain" } }),
      posting({ errorCode: OVERHEAD_COLLISION_CODE, coaAccount: null }),
    ]);
    expect(accounts).toEqual([]);
  });

  it("returns an empty list for an empty input", () => {
    expect(deriveBlockingOverheadAccounts([])).toEqual([]);
  });
});

describe("hasUnattributedBlockingPosting", () => {
  it("is true for a null error code", () => {
    expect(hasUnattributedBlockingPosting([posting({ errorCode: null })])).toBe(true);
  });

  it("is true for a code other than the overhead collision", () => {
    expect(hasUnattributedBlockingPosting([posting({ errorCode: "SOME_OTHER_CODE" })])).toBe(true);
  });

  it("is true for the collision code when the account did not resolve", () => {
    expect(hasUnattributedBlockingPosting([posting({ errorCode: OVERHEAD_COLLISION_CODE, coaAccount: null })])).toBe(true);
  });

  it("is false when every posting names a resolved overhead account", () => {
    const account = { id: "1", code: "5100", name: "Beban Sewa" };
    expect(hasUnattributedBlockingPosting([posting({ errorCode: OVERHEAD_COLLISION_CODE, coaAccount: account })])).toBe(false);
  });

  it("is false for an empty list", () => {
    expect(hasUnattributedBlockingPosting([])).toBe(false);
  });
});
