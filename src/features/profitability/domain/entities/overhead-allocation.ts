import { AbstractEntity } from "@/core/resources/entity";

export type OverheadCostSource = "allocated" | "none";

export type AllocationPeriod = {
  id: string;
  startAt: string;
  endAt: string;
};

type OverheadAllocationEntityConstructor = {
  source: OverheadCostSource;
  allocatedOverheadCostPerUnit: number;
  allocationPeriod: AllocationPeriod | null;
};

export class OverheadAllocationEntity implements AbstractEntity {
  public readonly source: OverheadCostSource;
  public readonly allocatedOverheadCostPerUnit: number;
  public readonly allocationPeriod: AllocationPeriod | null;

  constructor(args: OverheadAllocationEntityConstructor) {
    this.source = args.source;
    this.allocatedOverheadCostPerUnit = args.allocatedOverheadCostPerUnit;
    this.allocationPeriod = args.allocationPeriod;
  }
}
