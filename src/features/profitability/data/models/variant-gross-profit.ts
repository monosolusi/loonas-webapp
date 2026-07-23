import { AbstractModel } from "@/core/resources/model";
import { VariantGrossProfitEntity } from "@/features/profitability/domain/entities/variant-gross-profit";
import { VariantGrossProfitInputsModel } from "@/features/profitability/data/models/variant-gross-profit-inputs";
import { OverheadAllocationModel } from "@/features/profitability/data/models/overhead-allocation";

export class VariantGrossProfitModel implements AbstractModel {
  constructor(
    public readonly variantId: string,
    public readonly needsData: boolean,
    public readonly needsDataReason: string | null,
    public readonly estimatedGrossProfit: number | null,
    public readonly isEstimate: boolean,
    public readonly basis: string,
    public readonly formula: string | null,
    public readonly inputs: VariantGrossProfitInputsModel | null,
    public readonly overheadAllocation: OverheadAllocationModel,
  ) {}

  public static fromJson(data: Record<string, any>): VariantGrossProfitModel {
    return new VariantGrossProfitModel(
      data["variant"]["id"],
      data["needs_data"],
      data["needs_data_reason"],
      data["estimated_gross_profit"] ?? null,
      data["is_estimate"],
      data["basis"],
      data["formula"] ?? null,
      data["inputs"] != null ? VariantGrossProfitInputsModel.fromJson(data["inputs"]) : null,
      OverheadAllocationModel.fromJson(data),
    );
  }

  public toEntity(): VariantGrossProfitEntity {
    return new VariantGrossProfitEntity({
      variantId: this.variantId,
      needsData: this.needsData,
      needsDataReason: this.needsDataReason,
      estimatedGrossProfit: this.estimatedGrossProfit,
      isEstimate: this.isEstimate,
      basis: this.basis,
      formula: this.formula,
      inputs: this.inputs != null ? this.inputs.toEntity() : null,
      overheadAllocation: this.overheadAllocation.toEntity(),
    });
  }
}
