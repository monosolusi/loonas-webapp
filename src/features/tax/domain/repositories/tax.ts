import { DataState } from "@/core/resources/data-state";
import { CalculateTaxResultEntity } from "@/features/tax/domain/entities/calculate-tax-result";
import { TaxType } from "@/features/tax/domain/enums/tax-type";
import { SessionEntity } from "@/features/authentication/domain/entities/session";

export interface TaxRepositoryCalculateTaxParams {
  amountBeforeTax: number;
  taxType: TaxType;
  tax?: number;
  taxBase?: number;
}

export interface TaxRepository {
  calculateTax(
    params: TaxRepositoryCalculateTaxParams,
    session: SessionEntity,
  ): Promise<DataState<CalculateTaxResultEntity>>;
}
