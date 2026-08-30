import { AbstractModel } from "@/core/resources/model";
import { CashCategoryAccount, CashCategoryEntity } from "@/features/accounting/domain/entities/cash-category";
import { CashEntryCategory } from "@/features/accounting/domain/entities/cash-entry";
import { CashEntryDirection } from "@/features/accounting/domain/enums/cash-entry-direction";

/**
 * The spec's inline `account` object carries only `id`/`code`/`name` — no `type` — so this is
 * a dedicated value object rather than a partial `LedgerAccountModel` (which would mint a
 * ledger account with defaulted balance/type fields the resource never declares).
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

  public toValue(): CashCategoryAccount {
    return { id: this.id, code: this.code, name: this.name };
  }
}

/**
 * The full `CashCategoryResponse` resource. Originally scoped to the three fields the
 * `CashEntryResponse.category` object declares; extended in LNS-738 with the remaining
 * resource fields (`account`, `is_curated`, timestamps) — this class is load-bearing for
 * `CashEntryEntity.category` via `toValue()`, which must keep returning exactly
 * `{ id, name, direction }`.
 *
 * The cash-category routes are not mounted on dev-api yet, so `fromJson` is defensive on
 * every field, including the ones the spec calls non-nullable.
 */
export class CashCategoryModel implements AbstractModel {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly direction: CashEntryDirection,
    public readonly account: CashCategoryAccountModel,
    public readonly isCurated: boolean,
    public readonly createdAt: string,
    public readonly updatedAt: string,
  ) {}

  public static fromJson(data: Record<string, any>): CashCategoryModel {
    return new CashCategoryModel(
      data["id"] ?? "",
      data["name"] ?? "",
      (data["direction"] as CashEntryDirection) ?? CashEntryDirection.In,
      data["account"] != null
        ? CashCategoryAccountModel.fromJson(data["account"])
        : CashCategoryAccountModel.fromJson({}),
      data["is_curated"] ?? false,
      data["created_at"] ?? "",
      data["updated_at"] ?? "",
    );
  }

  public toValue(): CashEntryCategory {
    return { id: this.id, name: this.name, direction: this.direction };
  }

  public toEntity(): CashCategoryEntity {
    return new CashCategoryEntity({
      id: this.id,
      direction: this.direction,
      name: this.name,
      account: this.account.toValue(),
      isCurated: this.isCurated,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    });
  }
}
