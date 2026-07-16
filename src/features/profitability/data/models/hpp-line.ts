import { AbstractModel } from "@/core/resources/model";
import { RawMaterialModel } from "@/features/raw-material/data/models/raw-material";
import { HppLineEntity } from "@/features/profitability/domain/entities/hpp-line";

export class HppLineModel implements AbstractModel {
  constructor(
    public readonly rawMaterial: RawMaterialModel,
    public readonly quantity: number,
    public readonly weightedAverageCost: number,
    public readonly lineCost: number,
    public readonly costAvailable: boolean,
  ) {}

  public static fromJson(data: Record<string, any>): HppLineModel {
    return new HppLineModel(
      RawMaterialModel.fromJson(data["raw_material"]),
      data["quantity"],
      data["weighted_average_cost"],
      data["line_cost"],
      data["cost_available"],
    );
  }

  public toEntity(): HppLineEntity {
    return new HppLineEntity({
      rawMaterial: this.rawMaterial.toEntity(),
      quantity: this.quantity,
      weightedAverageCost: this.weightedAverageCost,
      lineCost: this.lineCost,
      costAvailable: this.costAvailable,
    });
  }
}
