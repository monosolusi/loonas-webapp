import { DataFailed, DataState, DataSuccess } from "@/core/resources/data-state";
import { TaxRepository, TaxRepositoryCalculateTaxParams } from "@/features/tax/domain/repositories/tax";
import { CalculateTaxResultEntity } from "../../domain/entities/calculate-tax-result";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { TaxService } from "@/features/tax/domain/sources/tax";
import { SessionEntity } from "@/features/authentication/domain/entities/session";

export class TaxRepositoryImpl implements TaxRepository {
  constructor(private readonly taxService: TaxService) {}

  public async calculateTax(
    params: TaxRepositoryCalculateTaxParams,
    session: SessionEntity,
  ): Promise<DataState<CalculateTaxResultEntity>> {
    try {
      const result = await this.taxService.calculateTax(
        {
          amountBeforeTax: params.amountBeforeTax,
          taxType: params.taxType,
          tax: params.tax,
          taxBase: params.taxBase,
        },
        session,
      );

      return new DataSuccess(result.toEntity());
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }
}
