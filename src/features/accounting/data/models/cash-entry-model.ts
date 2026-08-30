import { AbstractModel } from "@/core/resources/model";
import { CashEntryEntity } from "@/features/accounting/domain/entities/cash-entry";
import { CashEntryDirection } from "@/features/accounting/domain/enums/cash-entry-direction";
import { CashEntryStatus } from "@/features/accounting/domain/enums/cash-entry-status";
import { CashCategoryModel } from "@/features/accounting/data/models/cash-category-model";

/**
 * The live spec declares no `required:` array on `CashEntryResponse`, and the cash-entry
 * routes are not mounted on dev-api yet — so `fromJson` is defensive on every field,
 * including the ones the spec calls non-nullable.
 */
export class CashEntryModel implements AbstractModel {
  constructor(
    public readonly id: string,
    public readonly direction: CashEntryDirection,
    public readonly amount: number,
    public readonly category: CashCategoryModel,
    public readonly referenceNumber: string,
    public readonly status: CashEntryStatus,
    public readonly note: string | null,
    public readonly entryDate: string,
    public readonly journalEntryId: string | null,
    public readonly cancelsId: string | null,
    public readonly cancelledById: string | null,
    public readonly createdByUserId: string,
    public readonly createdAt: string,
    public readonly updatedAt: string,
  ) {}

  public static fromJson(data: Record<string, any>): CashEntryModel {
    return new CashEntryModel(
      data["id"] ?? "",
      (data["direction"] as CashEntryDirection) ?? CashEntryDirection.In,
      // `amount` is documented as a whole-rupiah integer, but the underlying column is
      // Postgres NUMERIC, which the (unwritten) BE mapper may pass through as a string —
      // parse defensively rather than trusting the declared type.
      Number(data["amount"] ?? 0),
      data["category"] != null ? CashCategoryModel.fromJson(data["category"]) : CashCategoryModel.fromJson({}),
      data["reference_number"] ?? "",
      (data["status"] as CashEntryStatus) ?? CashEntryStatus.Active,
      data["note"] ?? null,
      // `entry_date` on the wire — deliberately asymmetric with the `date` create-body key.
      data["entry_date"] ?? "",
      data["journal_entry_id"] ?? null,
      data["cancels_id"] ?? null,
      data["cancelled_by_id"] ?? null,
      data["created_by_user_id"] ?? "",
      data["created_at"] ?? "",
      data["updated_at"] ?? "",
    );
  }

  public toEntity(): CashEntryEntity {
    return new CashEntryEntity({
      id: this.id,
      direction: this.direction,
      amount: this.amount,
      category: this.category.toEntity(),
      referenceNumber: this.referenceNumber,
      status: this.status,
      note: this.note,
      entryDate: this.entryDate,
      journalEntryId: this.journalEntryId,
      cancelsId: this.cancelsId,
      cancelledById: this.cancelledById,
      createdByUserId: this.createdByUserId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    });
  }
}
