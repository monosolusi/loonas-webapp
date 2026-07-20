import { AbstractModel } from "@/core/resources/model";
import {
  AllocationPeriod,
  OverheadAllocationEntity,
  OverheadCostSource,
} from "@/features/profitability/domain/entities/overhead-allocation";

export class OverheadAllocationModel implements AbstractModel {
  constructor(
    public readonly source: OverheadCostSource,
    public readonly allocatedOverheadCostPerUnit: number,
    public readonly allocationPeriod: AllocationPeriod | null,
  ) {}

  public static fromJson(data: Record<string, any>): OverheadAllocationModel {
    const period = data["allocation_period"];
    return new OverheadAllocationModel(
      (data["overhead_cost_source"] as OverheadCostSource) ?? "none",
      data["allocated_overhead_cost_per_unit"] ?? 0,
      period != null
        ? { id: period["id"], startAt: period["start_at"], endAt: period["end_at"] }
        : null,
    );
  }

  public toEntity(): OverheadAllocationEntity {
    return new OverheadAllocationEntity({
      source: this.source,
      allocatedOverheadCostPerUnit: this.allocatedOverheadCostPerUnit,
      allocationPeriod: this.allocationPeriod,
    });
  }
}
