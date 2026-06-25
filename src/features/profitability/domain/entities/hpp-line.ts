import { AbstractEntity } from "@/core/resources/entity";

type HppLineEntityConstructor = {
  rawMaterialId: string;
  quantity: number;
  weightedAverageCost: number;
  lineCost: number;
  costAvailable: boolean;
};

export class HppLineEntity implements AbstractEntity {
  public readonly rawMaterialId: string;
  public readonly quantity: number;
  public readonly weightedAverageCost: number;
  public readonly lineCost: number;
  public readonly costAvailable: boolean;

  constructor(args: HppLineEntityConstructor) {
    this.rawMaterialId = args.rawMaterialId;
    this.quantity = args.quantity;
    this.weightedAverageCost = args.weightedAverageCost;
    this.lineCost = args.lineCost;
    this.costAvailable = args.costAvailable;
  }
}
