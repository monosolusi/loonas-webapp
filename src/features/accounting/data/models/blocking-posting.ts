import { AbstractModel } from "@/core/resources/model";
import { BlockingPosting, CoaAccountRef } from "@/features/accounting/domain/entities/blocking-posting";

export class CoaAccountRefModel implements AbstractModel {
  constructor(
    public readonly id: string,
    public readonly code: string,
    public readonly name: string,
  ) {}

  public static fromJson(data: Record<string, any>): CoaAccountRefModel {
    return new CoaAccountRefModel(data["id"] ?? "", data["code"] ?? "", data["name"] ?? "");
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
      data["coa_account"] != null ? CoaAccountRefModel.fromJson(data["coa_account"]) : null,
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
