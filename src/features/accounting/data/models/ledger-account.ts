import { AbstractModel } from "@/core/resources/model";
import { LedgerAccountEntity } from "@/features/accounting/domain/entities/ledger-account";
import { AccountType } from "@/features/accounting/domain/enums/account-type";

export class LedgerAccountModel implements AbstractModel {
  constructor(
    public readonly id: string,
    public readonly code: string,
    public readonly name: string,
    public readonly type: AccountType,
    public readonly parentId: string | null,
    public readonly isSystem: boolean,
    public readonly balance: number,
    public readonly totalDebit: number,
    public readonly totalCredit: number,
  ) {}

  public static fromJson(data: Record<string, any>): LedgerAccountModel {
    return new LedgerAccountModel(
      data["id"],
      data["code"],
      data["name"],
      data["type"] as AccountType,
      data["parent"]?.["id"] ?? null,
      data["is_system"] ?? false,
      data["balance"] ?? 0,
      data["total_debit"] ?? 0,
      data["total_credit"] ?? 0,
    );
  }

  public toEntity(): LedgerAccountEntity {
    return new LedgerAccountEntity({
      id: this.id,
      code: this.code,
      name: this.name,
      type: this.type,
      parentId: this.parentId,
      isSystem: this.isSystem,
      balance: this.balance,
      totalDebit: this.totalDebit,
      totalCredit: this.totalCredit,
    });
  }
}
