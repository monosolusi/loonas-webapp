import { AbstractModel } from "@/core/resources/model";
import { FixedCostModel } from "@/features/fixed-cost/data/models/fixed-cost";
import { FixedCostEntryEntity } from "@/features/fixed-cost/domain/entities/fixed-cost-entry";

type FixedCostEntryModelConstructor = {
  id: string;
  fixedCost: FixedCostModel | null;
  amount: number;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
};

export class FixedCostEntryModel implements AbstractModel {
  public readonly id: string;
  public readonly fixedCost: FixedCostModel | null;
  public readonly amount: number;
  public readonly startDate: string;
  public readonly endDate: string;
  public readonly createdAt: string;
  public readonly updatedAt: string;

  constructor(args: FixedCostEntryModelConstructor) {
    this.id = args.id;
    this.fixedCost = args.fixedCost;
    this.amount = args.amount;
    this.startDate = args.startDate;
    this.endDate = args.endDate;
    this.createdAt = args.createdAt;
    this.updatedAt = args.updatedAt;
  }

  public static fromJson(data: Record<string, any>): FixedCostEntryModel {
    return new FixedCostEntryModel({
      id: data["id"],
      fixedCost: data["fixed_cost"] ? FixedCostModel.fromJson(data["fixed_cost"]) : null,
      amount: data["amount"] ?? 0,
      startDate: data["start_date"] ?? "",
      endDate: data["end_date"] ?? "",
      createdAt: data["created_at"] ?? "",
      updatedAt: data["updated_at"] ?? "",
    });
  }

  public toEntity(): FixedCostEntryEntity {
    return new FixedCostEntryEntity({
      id: this.id,
      fixedCost: this.fixedCost?.toEntity() ?? null,
      amount: this.amount,
      startDate: this.startDate,
      endDate: this.endDate,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    });
  }
}
