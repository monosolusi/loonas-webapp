import { AbstractModel } from "@/core/resources/model";
import { AccountingPeriodEntity } from "@/features/accounting/domain/entities/accounting-period";

export class AccountingPeriodModel implements AbstractModel {
  constructor(
    public readonly id: string,
    public readonly accountId: string,
    public readonly kind: string,
    public readonly startDate: string,
    public readonly endDate: string,
    public readonly status: string,
    public readonly closedByUserId: string | null,
    public readonly closedAt: string | null,
    public readonly createdAt: string,
  ) {}

  public static fromJson(data: Record<string, any>): AccountingPeriodModel {
    return new AccountingPeriodModel(
      data["id"],
      data["account_id"],
      data["kind"] ?? "month",
      data["start_at"] ?? "",
      data["end_at"] ?? "",
      data["status"] ?? "open",
      data["closed_by"] ?? null,
      data["closed_at"] ?? null,
      data["created_at"] ?? "",
    );
  }

  public toEntity(): AccountingPeriodEntity {
    return new AccountingPeriodEntity({
      id: this.id,
      accountId: this.accountId,
      kind: this.kind,
      startDate: this.startDate,
      endDate: this.endDate,
      status: this.status,
      closedByUserId: this.closedByUserId,
      closedAt: this.closedAt,
      createdAt: this.createdAt,
    });
  }
}
