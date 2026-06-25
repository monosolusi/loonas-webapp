import { AbstractModel } from "@/core/resources/model";
import { VariantHppEntity } from "@/features/profitability/domain/entities/variant-hpp";
import { HppLineModel } from "@/features/profitability/data/models/hpp-line";

export class VariantHppModel implements AbstractModel {
  constructor(
    public readonly variantId: string,
    public readonly materialCostPerUnit: number,
    public readonly packagingCostPerUnit: number,
    public readonly overheadCostPerUnit: number,
    public readonly hppPerUnit: number,
    public readonly basis: string,
    public readonly lines: HppLineModel[],
  ) {}

  public static fromJson(data: Record<string, any>): VariantHppModel {
    return new VariantHppModel(
      data["variant"]["id"],
      data["material_cost_per_unit"],
      data["packaging_cost_per_unit"],
      data["overhead_cost_per_unit"],
      data["hpp_per_unit"],
      data["basis"],
      (data["lines"] ?? []).map(HppLineModel.fromJson),
    );
  }

  public toEntity(): VariantHppEntity {
    return new VariantHppEntity({
      variantId: this.variantId,
      materialCostPerUnit: this.materialCostPerUnit,
      packagingCostPerUnit: this.packagingCostPerUnit,
      overheadCostPerUnit: this.overheadCostPerUnit,
      hppPerUnit: this.hppPerUnit,
      basis: this.basis,
      lines: this.lines.map((l) => l.toEntity()),
    });
  }
}
