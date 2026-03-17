import { AbstractModel } from "@/core/resources/model";
import { JournalLineEntity } from "@/features/accounting/domain/entities/journal-line";

export class JournalLineModel implements AbstractModel {
  constructor(
    public readonly id: string,
    public readonly accountId: string,
    public readonly accountCode: string,
    public readonly accountName: string,
    public readonly debit: number,
    public readonly credit: number,
  ) {}

  public static fromJson(data: Record<string, any>): JournalLineModel {
    return new JournalLineModel(
      data["id"],
      data["account_id"],
      data["account_code"] ?? "",
      data["account_name"] ?? "",
      data["debit"] ?? 0,
      data["credit"] ?? 0,
    );
  }

  public toEntity(): JournalLineEntity {
    return new JournalLineEntity({
      id: this.id,
      accountId: this.accountId,
      accountCode: this.accountCode,
      accountName: this.accountName,
      debit: this.debit,
      credit: this.credit,
    });
  }
}
