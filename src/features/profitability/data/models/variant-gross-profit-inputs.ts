import { AbstractModel } from "@/core/resources/model";
import { VariantGrossProfitInputsEntity } from "@/features/profitability/domain/entities/variant-gross-profit-inputs";

export class VariantGrossProfitInputsModel implements AbstractModel {
  constructor(
    public readonly cogsPerUnit: number,
    public readonly unitsSold: number,
    public readonly posRevenue: number,
    public readonly periodFrom: string | null,
    public readonly periodTo: string | null,
  ) {}

  public static fromJson(data: Record<string, any>): VariantGrossProfitInputsModel {
    return new VariantGrossProfitInputsModel(
      data["cogs_per_unit"],
      data["units_sold"],
      data["pos_revenue"],
      data["period"]?.["from"] ?? null,
      data["period"]?.["to"] ?? null,
    );
  }

  public toEntity(): VariantGrossProfitInputsEntity {
    return new VariantGrossProfitInputsEntity({
      cogsPerUnit: this.cogsPerUnit,
      unitsSold: this.unitsSold,
      posRevenue: this.posRevenue,
      periodFrom: this.periodFrom,
      periodTo: this.periodTo,
    });
  }
}
