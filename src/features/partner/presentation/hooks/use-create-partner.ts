import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import { PartnerServiceImpl } from "@/features/partner/data/sources/partner";
import { LocalStorageSessionService } from "@/features/authentication/data/sources/local-storage-session";
import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { PartnerRepositoryImpl } from "@/features/partner/data/repositories/partner";
import { CreatePartnerUseCase, CreatePartnerUseCaseParams } from "@/features/partner/domain/usecases/create-partner";
import { DataFailed } from "@/core/resources/data-state";
import useSWRMutation from "swr/mutation";
import { HttpRequest } from "@/core/helpers/http-request";

interface CreatePartnerFetcherParams {
  arg: {
    name: string;
    email: string;
    phoneNumber: string;
  };
}

async function createPartnerFetcher(_: string, { arg }: CreatePartnerFetcherParams) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(arg.email)) throw new ServerError(ErrorCodes.INVALID_EMAIL);

  const parsedPhoneNumber =
    parsePhoneNumberFromString(arg.phoneNumber, { defaultCountry: "ID" }) ||
    parsePhoneNumberFromString(arg.phoneNumber, { defaultCountry: "SG" });

  // If still not valid, throw an error
  if (!parsedPhoneNumber || !parsedPhoneNumber.isValid()) throw new ServerError(ErrorCodes.INVALID_PHONE_NUMBER);

  const http = new HttpRequest();
  const partnerService = new PartnerServiceImpl(http);
  const sessionService = new LocalStorageSessionService();
  const sessionRepository = new SessionRepositoryImpl(sessionService);
  const partnerRepository = new PartnerRepositoryImpl(partnerService);
  const createPartner = new CreatePartnerUseCase(partnerRepository, sessionRepository);
  const createPartnerParams = new CreatePartnerUseCaseParams(arg.name, arg.email, parsedPhoneNumber.number.toString());

  const result = await createPartner.execute(createPartnerParams);
  if (result instanceof DataFailed) throw result.error;
  if (!result.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
  return result.data;
}

export function useCreatePartner() {
  return useSWRMutation("create-partner", createPartnerFetcher);
}
