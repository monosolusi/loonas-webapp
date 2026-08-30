import { AbstractModel } from "@/core/resources/model";
import { CashCategoryEntity } from "@/features/accounting/domain/entities/cash-category";
import { CashEntryDirection } from "@/features/accounting/domain/enums/cash-entry-direction";
import { CashCategoryAccountModel } from "@/features/accounting/data/models/cash-category-account-model";

/**
 * The full `CashCategoryResponse` resource. Originally scoped to the three fields the
 * `CashEntryResponse.category` object declares; extended in LNS-738 with the remaining
 * resource fields (`account`, `is_curated`, timestamps). `CashEntryModel.toEntity()` embeds
 * `toEntity()`'s result as `CashEntryEntity.category`, so the defaulted fields must keep
 * parsing a three-field wire shape.
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

  public toEntity(): CashCategoryEntity {
    return new CashCategoryEntity({
      id: this.id,
      direction: this.direction,
      name: this.name,
      account: this.account.toEntity(),
      isCurated: this.isCurated,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    });
  }
}
