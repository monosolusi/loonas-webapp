import { AbstractModel } from "@/core/resources/model";
import { HppLineEntity } from "@/features/profitability/domain/entities/hpp-line";

export class HppLineModel implements AbstractModel {
  constructor(
    public readonly rawMaterialId: string,
    public readonly quantity: number,
    public readonly weightedAverageCost: number,
    public readonly lineCost: number,
    public readonly costAvailable: boolean,
  ) {}

  public static fromJson(data: Record<string, any>): HppLineModel {
    return new HppLineModel(
      data["raw_material"]["id"],
      data["quantity"],
      data["weighted_average_cost"],
      data["line_cost"],
      data["cost_available"],
    );
  }

  public toEntity(): HppLineEntity {
    return new HppLineEntity({
      rawMaterialId: this.rawMaterialId,
      quantity: this.quantity,
      weightedAverageCost: this.weightedAverageCost,
      lineCost: this.lineCost,
      costAvailable: this.costAvailable,
    });
  }
}
