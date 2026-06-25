import { AbstractEntity } from "@/core/resources/entity";
import { VariantGrossProfitInputsEntity } from "@/features/profitability/domain/entities/variant-gross-profit-inputs";

type VariantGrossProfitEntityConstructor = {
  variantId: string;
  needsData: boolean;
  needsDataReason: string | null;
  estimasiLabaKotor: number | null;
  isEstimate: boolean;
  basis: string;
  formula: string | null;
  inputs: VariantGrossProfitInputsEntity | null;
};

export class VariantGrossProfitEntity implements AbstractEntity {
  public readonly variantId: string;
  public readonly needsData: boolean;
  public readonly needsDataReason: string | null;
  public readonly estimasiLabaKotor: number | null;
  public readonly isEstimate: boolean;
  public readonly basis: string;
  public readonly formula: string | null;
  public readonly inputs: VariantGrossProfitInputsEntity | null;

  constructor(args: VariantGrossProfitEntityConstructor) {
    this.variantId = args.variantId;
    this.needsData = args.needsData;
    this.needsDataReason = args.needsDataReason;
    this.estimasiLabaKotor = args.estimasiLabaKotor;
    this.isEstimate = args.isEstimate;
    this.basis = args.basis;
    this.formula = args.formula;
    this.inputs = args.inputs;
  }
}
