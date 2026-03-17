import { AbstractModel } from "@/core/resources/model";
import { LedgerEntryEntity } from "@/features/accounting/domain/entities/ledger-entry";

export class LedgerEntryModel implements AbstractModel {
  constructor(
    public readonly id: string,
    public readonly accountId: string,
    public readonly accountCode: string,
    public readonly accountName: string,
    public readonly debit: number,
    public readonly credit: number,
    public readonly date: string,
    public readonly memo: string,
  ) {}

  public static fromJson(data: Record<string, any>): LedgerEntryModel {
    return new LedgerEntryModel(
      data["id"],
      data["account_id"],
      data["account_code"] ?? "",
      data["account_name"] ?? "",
      data["debit"] ?? 0,
      data["credit"] ?? 0,
      data["date"] ?? "",
      data["memo"] ?? "",
    );
  }

  public toEntity(): LedgerEntryEntity {
    return new LedgerEntryEntity({
      id: this.id,
      accountId: this.accountId,
      accountCode: this.accountCode,
      accountName: this.accountName,
      debit: this.debit,
      credit: this.credit,
      date: this.date,
      memo: this.memo,
    });
  }
}
