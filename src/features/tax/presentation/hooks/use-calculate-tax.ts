import { useClerk } from "@clerk/nextjs";
import { ClerkSessionService } from "@/features/authentication/data/sources/clerk-session.service";
import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { DataFailed } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { useSWRMutationClerk } from "@/core/helpers/use-swr-mutation-clerk";
import { CalculateTaxUseCase, CalculateTaxUseCaseParams } from "@/features/tax/domain/usecases/calculate-tax";
import { TaxRepositoryImpl } from "@/features/tax/data/repositories/tax";
import { TaxServiceImpl } from "@/features/tax/data/sources/tax";
import { HttpRequest } from "@/core/helpers/http-request";
import { TaxType } from "@/features/tax/domain/enums/tax-type";

type FetcherProps = {
  amountBeforeTax: number;
  taxType: TaxType;
  tax?: number;
  taxBase?: number;
};

type FetcherParams = FetcherProps & {
  clerk: ReturnType<typeof useClerk>;
};

async function calculateTaxFetcher(_: string, { arg }: { arg: FetcherParams }) {
  const sessionService = new ClerkSessionService({ clerk: arg.clerk });
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
  return useSWRMutationClerk("calculate-tax", calculateTaxFetcher);
}
