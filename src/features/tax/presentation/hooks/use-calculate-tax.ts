import { LocalStorageSessionService } from "@/features/authentication/data/sources/local-storage-session";
import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { DataFailed } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import useSWRMutation from "swr/mutation";
import { CalculateTaxUseCase, CalculateTaxUseCaseParams } from "@/features/tax/domain/usecases/calculate-tax";
import { TaxRepositoryImpl } from "@/features/tax/data/repositories/tax";
import { TaxServiceImpl } from "@/features/tax/data/sources/tax";
import { HttpRequest } from "@/core/helpers/http-request";
import { TaxType } from "@/features/tax/domain/enums/tax-type";

interface FetcherParams {
  amountBeforeTax: number;
  taxType: TaxType;
  tax?: number;
  taxBase?: number;
}

async function calculateTaxFetcher(_: string, { arg }: { arg: FetcherParams }) {
  const sessionService = new LocalStorageSessionService();
  const sessionRepository = new SessionRepositoryImpl(sessionService);

  const httpRequest = new HttpRequest();
  const taxService = new TaxServiceImpl(httpRequest);
  const taxRepository = new TaxRepositoryImpl(taxService);

  const calculate = new CalculateTaxUseCase(taxRepository, sessionRepository);
  const calculateParams = new CalculateTaxUseCaseParams({
    amountBeforeTax: arg.amountBeforeTax,
    taxType: arg.taxType,
    tax: arg.tax,
    taxBase: arg.taxBase,
  });

  const result = await calculate.execute(calculateParams);
  if (result instanceof DataFailed) throw result.error;
  if (!result.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
  return result.data;
}

export function useCalculateTax() {
  return useSWRMutation("calculate-tax", calculateTaxFetcher);
}
