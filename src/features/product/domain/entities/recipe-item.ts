import { AbstractEntity } from "@/core/resources/entity";
import { RawMaterialEntity } from "@/features/raw-material/domain/entities/raw-material";

type RecipeItemEntityConstructor = {
  id: string;
  rawMaterial: RawMaterialEntity;
  quantity: number;
  createdAt: string;
};

export class RecipeItemEntity implements AbstractEntity {
  public id: string;
  public rawMaterial: RawMaterialEntity;
  public quantity: number;
  public createdAt: string;

  constructor(args: RecipeItemEntityConstructor) {
    this.id = args.id;
    this.rawMaterial = args.rawMaterial;
    this.quantity = args.quantity;
    this.createdAt = args.createdAt;
  }
}
