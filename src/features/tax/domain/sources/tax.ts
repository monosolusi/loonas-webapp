import { TaxType } from "@/features/tax/domain/enums/tax-type";
import { CalculateTaxResultModel } from "@/features/tax/data/models/calculate-tax-result";
import { SessionEntity } from "@/features/authentication/domain/entities/session";

export interface CalculateTaxParams {
  amountBeforeTax: number;
  taxType: TaxType;
  tax?: number;
  taxBase?: number;
}

export interface TaxService {
  calculateTax(params: CalculateTaxParams, session: SessionEntity): Promise<CalculateTaxResultModel>;
}
