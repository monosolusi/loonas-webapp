import { PartnerEntity } from "@/features/partner/domain/entities/partner";

export type CreateIncomingInvoiceContextProps = {
  recipient?: PartnerEntity;
  setRecipient?: React.Dispatch<React.SetStateAction<PartnerEntity | undefined>>;
};

export type CreateIncomingInvoiceProviderProps = {
  children: React.ReactNode;
};
