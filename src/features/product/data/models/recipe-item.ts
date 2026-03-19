import { AbstractModel } from "@/core/resources/model";
import { RawMaterialModel } from "@/features/raw-material/data/models/raw-material";
import { RecipeItemEntity } from "@/features/product/domain/entities/recipe-item";

type RecipeItemModelConstructor = {
  id: string;
  rawMaterial: RawMaterialModel;
  quantity: number;
  createdAt: string;
};

export class RecipeItemModel implements AbstractModel {
  public readonly id: string;
  public readonly rawMaterial: RawMaterialModel;
  public readonly quantity: number;
  public readonly createdAt: string;

  constructor(args: RecipeItemModelConstructor) {
    this.id = args.id;
    this.rawMaterial = args.rawMaterial;
    this.quantity = args.quantity;
    this.createdAt = args.createdAt;
  }

  public static fromJson(data: Record<string, any>): RecipeItemModel {
    return new RecipeItemModel({
      id: data["id"],
      rawMaterial: RawMaterialModel.fromJson(data["raw_material"]),
      quantity: data["quantity"],
      createdAt: data["created_at"] ?? "",
    });
  }

  public toEntity(): RecipeItemEntity {
    return new RecipeItemEntity({
      id: this.id,
      rawMaterial: this.rawMaterial.toEntity(),
      quantity: this.quantity,
      createdAt: this.createdAt,
    });
  }
}
