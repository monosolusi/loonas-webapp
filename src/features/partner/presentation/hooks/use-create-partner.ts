import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import { PartnerServiceImpl } from "@/features/partner/data/sources/partner";
import { PartnerRepositoryImpl } from "@/features/partner/data/repositories/partner";
import { CreatePartnerUseCase, CreatePartnerUseCaseParams } from "@/features/partner/domain/usecases/create-partner";
import { DataFailed } from "@/core/resources/data-state";
import { HttpRequest } from "@/core/helpers/http-request";
import { CreatePartnerFetcherParams } from "@/features/partner/presentation/hooks/use-create-partner.types";
import { ClerkSessionService } from "@/features/authentication/data/sources/clerk-session.service";
import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { useSWRMutationClerk } from "@/core/helpers/use-swr-mutation-clerk";

async function CreatePartnerFetcher(_: string, { arg }: { arg: CreatePartnerFetcherParams }) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(arg.email)) throw new ServerError(ErrorCodes.INVALID_EMAIL);

  const parsedPhoneNumber =
    parsePhoneNumberFromString(arg.phoneNumber, { defaultCountry: "ID" }) ||
    parsePhoneNumberFromString(arg.phoneNumber, { defaultCountry: "SG" });

  // If still not valid, throw an error
  if (!parsedPhoneNumber || !parsedPhoneNumber.isValid()) throw new ServerError(ErrorCodes.INVALID_PHONE_NUMBER);

  const sessionRepository = new SessionRepositoryImpl(new ClerkSessionService({ clerk: arg.clerk }));
  const partnerRepository = new PartnerRepositoryImpl(new PartnerServiceImpl(new HttpRequest()));
  const createPartner = new CreatePartnerUseCase(partnerRepository, sessionRepository);
  const createPartnerParams = new CreatePartnerUseCaseParams(arg.name, arg.email, parsedPhoneNumber.number.toString());

  const result = await createPartner.execute(createPartnerParams);
  if (result instanceof DataFailed) throw result.error;
  if (!result.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
  return result.data;
}

export function useCreatePartner() {
  return useSWRMutationClerk("create-partner", CreatePartnerFetcher);
}
