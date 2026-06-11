import { AbstractModel } from "@/core/resources/model";
import { FixedCostEntity } from "@/features/fixed-cost/domain/entities/fixed-cost";

type FixedCostModelConstructor = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};

export class FixedCostModel implements AbstractModel {
  public readonly id: string;
  public readonly name: string;
  public readonly createdAt: string;
  public readonly updatedAt: string;

  constructor(args: FixedCostModelConstructor) {
    this.id = args.id;
    this.name = args.name;
    this.createdAt = args.createdAt;
    this.updatedAt = args.updatedAt;
  }

  public static fromJson(data: Record<string, any>): FixedCostModel {
    return new FixedCostModel({
      id: data["id"],
      name: data["name"],
      createdAt: data["created_at"] ?? "",
      updatedAt: data["updated_at"] ?? "",
    });
  }

  public toEntity(): FixedCostEntity {
    return new FixedCostEntity({
      id: this.id,
      name: this.name,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    });
  }
}
