import { AbstractModel } from "@/core/resources/model";
import { VariantProductionCostEntity } from "@/features/profitability/domain/entities/variant-production-cost";

export class VariantProductionCostModel implements AbstractModel {
  constructor(
    public readonly variantId: string,
    public readonly quantity: number,
    public readonly hppPerUnit: number,
    public readonly fixedComponent: number,
    public readonly variableComponent: number,
    public readonly totalProductionCost: number,
    public readonly periodFrom: string | null,
    public readonly periodTo: string | null,
  ) {}

  public static fromJson(data: Record<string, any>): VariantProductionCostModel {
    return new VariantProductionCostModel(
      data["variant"]["id"],
      data["quantity"],
      data["hpp_per_unit"],
      data["fixed_component"],
      data["variable_component"],
      data["total_production_cost"],
      data["period"]?.["from"] ?? null,
      data["period"]?.["to"] ?? null,
    );
  }

  public toEntity(): VariantProductionCostEntity {
    return new VariantProductionCostEntity({
      variantId: this.variantId,
      quantity: this.quantity,
      hppPerUnit: this.hppPerUnit,
      fixedComponent: this.fixedComponent,
      variableComponent: this.variableComponent,
      totalProductionCost: this.totalProductionCost,
      periodFrom: this.periodFrom,
      periodTo: this.periodTo,
    });
  }
}
