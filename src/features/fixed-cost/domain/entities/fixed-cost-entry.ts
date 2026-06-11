import { AbstractEntity } from "@/core/resources/entity";
import { FixedCostEntity } from "@/features/fixed-cost/domain/entities/fixed-cost";

type FixedCostEntryEntityConstructor = {
  id: string;
  fixedCost: FixedCostEntity | null;
  amount: number;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
};

export class FixedCostEntryEntity implements AbstractEntity {
  public id: string;
  public fixedCost: FixedCostEntity | null;
  public amount: number;
  public startDate: string;
  public endDate: string;
  public createdAt: string;
  public updatedAt: string;

  constructor(args: FixedCostEntryEntityConstructor) {
    this.id = args.id;
    this.fixedCost = args.fixedCost;
    this.amount = args.amount;
    this.startDate = args.startDate;
    this.endDate = args.endDate;
    this.createdAt = args.createdAt;
    this.updatedAt = args.updatedAt;
  }
}
