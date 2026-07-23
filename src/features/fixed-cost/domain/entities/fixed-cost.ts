import { AbstractEntity } from "@/core/resources/entity";
import { FixedCostCategory } from "@/features/fixed-cost/domain/enums/fixed-cost-category";

type FixedCostEntityConstructor = {
  id: string;
  name: string;
  category: FixedCostCategory;
  createdAt: string;
  updatedAt: string;
};

export class FixedCostEntity implements AbstractEntity {
  public readonly id: string;
  public readonly name: string;
  public readonly category: FixedCostCategory;
  public readonly createdAt: string;
  public readonly updatedAt: string;

  constructor(args: FixedCostEntityConstructor) {
    this.id = args.id;
    this.name = args.name;
    this.category = args.category;
    this.createdAt = args.createdAt;
    this.updatedAt = args.updatedAt;
  }
}
