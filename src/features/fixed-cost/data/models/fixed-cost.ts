import { AbstractModel } from "@/core/resources/model";
import { FixedCostEntity } from "@/features/fixed-cost/domain/entities/fixed-cost";
import { FixedCostCategory } from "@/features/fixed-cost/domain/enums/fixed-cost-category";

type FixedCostModelConstructor = {
  id: string;
  name: string;
  category: FixedCostCategory;
  createdAt: string;
  updatedAt: string;
};

export class FixedCostModel implements AbstractModel {
  public readonly id: string;
  public readonly name: string;
  public readonly category: FixedCostCategory;
  public readonly createdAt: string;
  public readonly updatedAt: string;

  constructor(args: FixedCostModelConstructor) {
    this.id = args.id;
    this.name = args.name;
    this.category = args.category;
    this.createdAt = args.createdAt;
    this.updatedAt = args.updatedAt;
  }

  public static fromJson(data: Record<string, any>): FixedCostModel {
    return new FixedCostModel({
      id: data["id"],
      name: data["name"],
      category: data["category"] ?? "general",
      createdAt: data["created_at"] ?? "",
      updatedAt: data["updated_at"] ?? "",
    });
  }

  public toEntity(): FixedCostEntity {
    return new FixedCostEntity({
      id: this.id,
      name: this.name,
      category: this.category,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    });
  }
}
