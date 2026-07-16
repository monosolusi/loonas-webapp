import { AbstractModel } from "@/core/resources/model";
import { VariantCogsEntity } from "@/features/profitability/domain/entities/variant-cogs";
import { CogsLineModel } from "@/features/profitability/data/models/cogs-line";

export class VariantCogsModel implements AbstractModel {
  constructor(
    public readonly variantId: string,
    public readonly materialCostPerUnit: number,
    public readonly packagingCostPerUnit: number,
    public readonly overheadCostPerUnit: number,
    public readonly cogsPerUnit: number,
    public readonly basis: string,
    public readonly lines: CogsLineModel[],
  ) {}

  public static fromJson(data: Record<string, any>): VariantCogsModel {
    return new VariantCogsModel(
      data["variant"]["id"],
      data["material_cost_per_unit"],
      data["packaging_cost_per_unit"],
      data["overhead_cost_per_unit"],
      data["cogs_per_unit"],
      data["basis"],
      (data["lines"] ?? []).map(CogsLineModel.fromJson),
    );
  }

  public toEntity(): VariantCogsEntity {
    return new VariantCogsEntity({
      variantId: this.variantId,
      materialCostPerUnit: this.materialCostPerUnit,
      packagingCostPerUnit: this.packagingCostPerUnit,
      overheadCostPerUnit: this.overheadCostPerUnit,
      cogsPerUnit: this.cogsPerUnit,
      basis: this.basis,
      lines: this.lines.map((l) => l.toEntity()),
    });
  }
}
