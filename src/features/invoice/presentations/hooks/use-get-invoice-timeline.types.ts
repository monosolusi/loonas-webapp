import { useClerk } from "@clerk/nextjs";
import { InvoiceTimelineEntity } from "@/features/invoice/domain/entities/invoice-timeline";
import { ServerError } from "@/core/resources/server-error";

export type UseGetInvoiceTimelineParams = {
  id: string;
};

export type GetInvoiceTimelineFetcherParams = UseGetInvoiceTimelineParams & {
  clerk: ReturnType<typeof useClerk>;
};

type InitialState = {
  timeline: null;
  loading: true;
  error: null;
};

type LoadedState = {
  timeline: InvoiceTimelineEntity;
  loading: false;
  error: null;
};

type ErrorState = {
  timeline: null;
  loading: false;
  error: ServerError;
};

export type UseGetInvoiceTimelineReturnType = InitialState | LoadedState | ErrorState;
