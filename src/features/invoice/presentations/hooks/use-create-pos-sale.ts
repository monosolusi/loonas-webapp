"use client";

import { mutate as globalMutate } from "swr";
import { HttpRequest } from "@/core/helpers/http-request";
import { DataFailed } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { useSWRMutationClerk } from "@/core/helpers/use-swr-mutation-clerk";
import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { ClerkSessionService } from "@/features/authentication/data/sources/clerk-session.service";
import { InvoiceRepositoryImpl } from "@/features/invoice/data/repositories/invoice";
import { InvoiceServiceImpl } from "@/features/invoice/data/sources/invoice";
import { OutgoingInvoiceEntity } from "@/features/invoice/domain/entities/outgoing-invoice";
import { PayInDetailFactory } from "@/features/invoice/domain/factories/pay-in-detail-factory";
import {
  CreatePosSaleUseCase,
  CreatePosSaleUseCaseParams,
} from "@/features/invoice/domain/usecases/create-pos-sale.usecases";
import {
  CreatePosSaleFetcherParams,
  CreatePosSaleHookParams,
} from "@/features/invoice/presentations/hooks/use-create-pos-sale.types";
import { INVOICE_SWR_KEYS } from "@/features/invoice/presentations/constants/swr-keys";

async function CreatePosSaleFetcher(
  _: string,
  { arg }: { arg: CreatePosSaleFetcherParams },
): Promise<OutgoingInvoiceEntity> {
  const sessionRepository = new SessionRepositoryImpl(new ClerkSessionService({ clerk: arg.clerk }));
  const invoiceRepository = new InvoiceRepositoryImpl(
    new InvoiceServiceImpl(new HttpRequest()),
    new PayInDetailFactory(),
  );
  const createPosSale = new CreatePosSaleUseCase(invoiceRepository, sessionRepository);

  const result = await createPosSale.execute(
    new CreatePosSaleUseCaseParams(
      arg.date,
      arg.paymentGatewayId,
      arg.discount,
      arg.note,
      arg.tenderedAmount,
      arg.items,
      arg.idempotencyKey,
    ),
  );
  if (result instanceof DataFailed) throw result.error;
  if (!result.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

  const invoice = result.data;
  // Prime SWR cache for `useGetInvoice` so receipt page renders immediately
  // without a roundtrip after navigation.
  await globalMutate(
    (key: unknown) =>
      Array.isArray(key) &&
      key[0] === INVOICE_SWR_KEYS.GET_INVOICE &&
      (key[1] as { id?: string } | undefined)?.id === invoice.id,
    invoice,
    { revalidate: false },
  );

  return invoice;
}

export function useCreatePosSale() {
  return useSWRMutationClerk<OutgoingInvoiceEntity, CreatePosSaleHookParams>(
    INVOICE_SWR_KEYS.CREATE_POS_SALE,
    CreatePosSaleFetcher,
  );
}
