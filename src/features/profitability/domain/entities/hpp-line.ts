import { AbstractEntity } from "@/core/resources/entity";
import { RawMaterialEntity } from "@/features/raw-material/domain/entities/raw-material";

type HppLineEntityConstructor = {
  rawMaterial: RawMaterialEntity;
  quantity: number;
  weightedAverageCost: number;
  lineCost: number;
  costAvailable: boolean;
};

export class HppLineEntity implements AbstractEntity {
  public readonly rawMaterial: RawMaterialEntity;
  public readonly quantity: number;
  public readonly weightedAverageCost: number;
  public readonly lineCost: number;
  public readonly costAvailable: boolean;

  constructor(args: HppLineEntityConstructor) {
    this.rawMaterial = args.rawMaterial;
    this.quantity = args.quantity;
    this.weightedAverageCost = args.weightedAverageCost;
    this.lineCost = args.lineCost;
    this.costAvailable = args.costAvailable;
  }
}
