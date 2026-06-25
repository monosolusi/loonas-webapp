import { AbstractModel } from "@/core/resources/model";
import { VariantGrossProfitEntity } from "@/features/profitability/domain/entities/variant-gross-profit";
import { VariantGrossProfitInputsModel } from "@/features/profitability/data/models/variant-gross-profit-inputs";

export class VariantGrossProfitModel implements AbstractModel {
  constructor(
    public readonly variantId: string,
    public readonly needsData: boolean,
    public readonly needsDataReason: string | null,
    public readonly estimasiLabaKotor: number | null,
    public readonly isEstimate: boolean,
    public readonly basis: string,
    public readonly formula: string | null,
    public readonly inputs: VariantGrossProfitInputsModel | null,
  ) {}

  public static fromJson(data: Record<string, any>): VariantGrossProfitModel {
    return new VariantGrossProfitModel(
      data["variant"]["id"],
      data["needs_data"],
      data["needs_data_reason"],
      data["estimasi_laba_kotor"] ?? null,
      data["is_estimate"],
      data["basis"],
      data["formula"] ?? null,
      data["inputs"] != null ? VariantGrossProfitInputsModel.fromJson(data["inputs"]) : null,
    );
  }

  public toEntity(): VariantGrossProfitEntity {
    return new VariantGrossProfitEntity({
      variantId: this.variantId,
      needsData: this.needsData,
      needsDataReason: this.needsDataReason,
      estimasiLabaKotor: this.estimasiLabaKotor,
      isEstimate: this.isEstimate,
      basis: this.basis,
      formula: this.formula,
      inputs: this.inputs != null ? this.inputs.toEntity() : null,
    });
  }
}
