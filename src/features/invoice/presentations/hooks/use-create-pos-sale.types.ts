import { useClerk } from "@clerk/nextjs";

export type CreatePosSaleHookItem = {
  variantId: string;
  quantity: number;
  unitPrice: number;
  discount: number;
};

export type CreatePosSaleHookParams = {
  date: string;
  paymentGatewayId: string;
  discount: number;
  note?: string;
  tenderedAmount?: number;
  items: CreatePosSaleHookItem[];
  idempotencyKey: string;
};

export type CreatePosSaleFetcherParams = CreatePosSaleHookParams & {
  clerk: ReturnType<typeof useClerk>;
};
