import { AbstractModel } from "@/core/resources/model";
import { BlockingPosting, CoaAccountRef } from "@/features/accounting/domain/entities/blocking-posting";
import { parseCoaAccountRef } from "@/features/accounting/domain/helpers/blocking-posting";

export class CoaAccountRefModel implements AbstractModel {
  constructor(
    public readonly id: string,
    public readonly code: string,
    public readonly name: string,
  ) {}

  /**
   * `null` when `data` does not yield a usable `{id, code, name}` — validated through the SAME
   * `parseCoaAccountRef` helper the close-422 diagnosis resolver uses, so a malformed value is
   * excluded on both paths rather than silently defaulting to blank fields here.
   */
  public static fromJson(data: unknown): CoaAccountRefModel | null {
    const ref = parseCoaAccountRef(data);
    if (!ref) return null;
    return new CoaAccountRefModel(ref.id, ref.code, ref.name);
  }

  public toValue(): CoaAccountRef {
    return { id: this.id, code: this.code, name: this.name };
  }
}

export class BlockingPostingModel implements AbstractModel {
  constructor(
    public readonly sourceTable: string,
    public readonly outboxId: string,
    public readonly errorCode: string | null,
    public readonly coaAccount: CoaAccountRefModel | null,
  ) {}

  public static fromJson(data: Record<string, any>): BlockingPostingModel {
    return new BlockingPostingModel(
      data["source_table"] ?? "",
      data["outbox_id"] ?? "",
      typeof data["error_code"] === "string" ? data["error_code"] : null,
      CoaAccountRefModel.fromJson(data["coa_account"]),
    );
  }

  public toValue(): BlockingPosting {
    return {
      sourceTable: this.sourceTable,
      outboxId: this.outboxId,
      errorCode: this.errorCode,
      coaAccount: this.coaAccount ? this.coaAccount.toValue() : null,
    };
  }
}
