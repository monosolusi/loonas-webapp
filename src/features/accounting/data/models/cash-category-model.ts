import { AbstractModel } from "@/core/resources/model";
import { CashEntryCategory } from "@/features/accounting/domain/entities/cash-entry";
import { CashEntryDirection } from "@/features/accounting/domain/enums/cash-entry-direction";

/**
 * Scoped to exactly the three fields the `CashEntryResponse.category` object declares
 * (`id`, `name`, `direction`) — not the full `CashCategoryResponse` resource (which also
 * carries `is_curated`, `account`, timestamps). A future ticket that needs the full cash
 * category resource should extend this file rather than mint a second model for the same
 * BE concept.
 */
export class CashCategoryModel implements AbstractModel {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly direction: CashEntryDirection,
  ) {}

  public static fromJson(data: Record<string, any>): CashCategoryModel {
    return new CashCategoryModel(
      data["id"] ?? "",
      data["name"] ?? "",
      (data["direction"] as CashEntryDirection) ?? CashEntryDirection.In,
    );
  }

  public toValue(): CashEntryCategory {
    return { id: this.id, name: this.name, direction: this.direction };
  }
}
