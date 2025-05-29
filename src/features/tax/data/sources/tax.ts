import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { CalculateTaxParams, TaxService } from "@/features/tax/domain/sources/tax";
import { CalculateTaxResultModel } from "../models/calculate-tax-result";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { HttpRequest } from "@/core/helpers/http-request";

export class TaxServiceImpl implements TaxService {
  constructor(private readonly http: HttpRequest) {}

  public async calculateTax(params: CalculateTaxParams, session: SessionEntity): Promise<CalculateTaxResultModel> {
    try {
      const path = "/tax/calculate";
      const method = "POST";
      const body = {
        amount_before_tax: params.amountBeforeTax,
        tax_type: params.taxType,
        tax: params.tax,
        tax_base: params.taxBase,
      };

      const result = await this.http.request({ path, method, body, session });
      if (!result) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
      return CalculateTaxResultModel.fromJson(result);
    } catch (err) {
      if (err instanceof ServerError) throw err;
      else throw new ServerError(ErrorCodes.UNKNOWN, { error: err });
    }
  }
}
