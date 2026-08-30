import { AbstractModel } from "@/core/resources/model";
import { CashCategoryAccount } from "@/features/accounting/domain/entities/cash-category";

/**
 * The spec's inline `account` object carries only `id`/`code`/`name` — no `type` — so this is
 * a dedicated model rather than a partial `LedgerAccountModel` (which would mint a ledger
 * account with defaulted balance/type fields the resource never declares).
 */
export class CashCategoryAccountModel implements AbstractModel {
  constructor(
    public readonly id: string,
    public readonly code: string,
    public readonly name: string,
  ) {}

  public static fromJson(data: Record<string, any>): CashCategoryAccountModel {
    return new CashCategoryAccountModel(data["id"] ?? "", data["code"] ?? "", data["name"] ?? "");
  }

  public toEntity(): CashCategoryAccount {
    return { id: this.id, code: this.code, name: this.name };
  }
}
