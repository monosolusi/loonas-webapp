import { describe, expect, it } from "vitest";
import { BlockingPostingModel, CoaAccountRefModel } from "@/features/accounting/data/models/blocking-posting";

describe("CoaAccountRefModel", () => {
  it("parses a well-formed account ref", () => {
    const model = CoaAccountRefModel.fromJson({ id: "acc-1", code: "5100", name: "Beban Sewa" });
    expect(model?.toValue()).toEqual({ id: "acc-1", code: "5100", name: "Beban Sewa" });
  });

  it("returns null for missing fields rather than defaulting to blank strings", () => {
    // Regression: this used to default id/code/name to "" and always return an instance, which
    // diverged from the close-422 diagnosis resolver's parser (that one correctly returned null) —
    // a malformed coa_account rendered a blank " — " label and enabled the retry button.
    expect(CoaAccountRefModel.fromJson({})).toBeNull();
  });

  it("returns null when a field is present but not a string", () => {
    expect(CoaAccountRefModel.fromJson({ id: 123, code: "5100", name: "Beban Sewa" })).toBeNull();
  });

  it("returns null for a non-object value, without crashing", () => {
    expect(CoaAccountRefModel.fromJson(null)).toBeNull();
    expect(CoaAccountRefModel.fromJson("acc-1")).toBeNull();
  });
});

describe("BlockingPostingModel", () => {
  it("parses a fully-attributed overhead-collision posting", () => {
    const model = BlockingPostingModel.fromJson({
      source_table: "pos_sales",
      outbox_id: "ob-1",
      error_code: "OVERHEAD_ACCOUNT_AUTO_POSTING_REFUSED",
      coa_account: { id: "acc-1", code: "5100", name: "Beban Sewa" },
    });
    expect(model.toValue()).toEqual({
      sourceTable: "pos_sales",
      outboxId: "ob-1",
      errorCode: "OVERHEAD_ACCOUNT_AUTO_POSTING_REFUSED",
      coaAccount: { id: "acc-1", code: "5100", name: "Beban Sewa" },
    });
  });

  it("keeps a null error_code distinct from an attributed one — the server could not diagnose it", () => {
    const model = BlockingPostingModel.fromJson({
      source_table: "pos_sales",
      outbox_id: "ob-2",
      error_code: null,
      coa_account: null,
    });
    expect(model.toValue().errorCode).toBeNull();
    expect(model.toValue().coaAccount).toBeNull();
  });

  it("renders without an account when error_code is attributed but coa_account did not resolve", () => {
    const model = BlockingPostingModel.fromJson({
      source_table: "pos_sales",
      outbox_id: "ob-3",
      error_code: "OVERHEAD_ACCOUNT_AUTO_POSTING_REFUSED",
      coa_account: null,
    });
    expect(model.toValue().errorCode).toBe("OVERHEAD_ACCOUNT_AUTO_POSTING_REFUSED");
    expect(model.toValue().coaAccount).toBeNull();
  });

  it("falls back to safe defaults for missing/malformed fields, without crashing", () => {
    const model = BlockingPostingModel.fromJson({ error_code: 42 });
    expect(model.toValue()).toEqual({ sourceTable: "", outboxId: "", errorCode: null, coaAccount: null });
  });

  it("renders without an account when coa_account is present but malformed — never a blank-labelled account", () => {
    const model = BlockingPostingModel.fromJson({
      source_table: "pos_sales",
      outbox_id: "ob-4",
      error_code: "OVERHEAD_ACCOUNT_AUTO_POSTING_REFUSED",
      coa_account: { id: "acc-1" }, // missing code/name
    });
    expect(model.toValue().coaAccount).toBeNull();
  });
});
