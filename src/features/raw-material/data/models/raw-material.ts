import { AbstractModel } from "@/core/resources/model";
import { RawMaterialEntity } from "@/features/raw-material/domain/entities/raw-material";

type RawMaterialModelConstructor = {
  id: string;
  name: string;
  unit: string;
  createdAt: string;
  updatedAt: string;
};

export class RawMaterialModel implements AbstractModel {
  public readonly id: string;
  public readonly name: string;
  public readonly unit: string;
  public readonly createdAt: string;
  public readonly updatedAt: string;

  constructor(args: RawMaterialModelConstructor) {
    this.id = args.id;
    this.name = args.name;
    this.unit = args.unit;
    this.createdAt = args.createdAt;
    this.updatedAt = args.updatedAt;
  }

  public static fromJson(data: Record<string, any>): RawMaterialModel {
    return new RawMaterialModel({
      id: data["id"],
      name: data["name"],
      unit: data["unit"],
      createdAt: data["created_at"] ?? "",
      updatedAt: data["updated_at"] ?? "",
    });
  }

  public toEntity(): RawMaterialEntity {
    return new RawMaterialEntity({
      id: this.id,
      name: this.name,
      unit: this.unit,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    });
  }
}
