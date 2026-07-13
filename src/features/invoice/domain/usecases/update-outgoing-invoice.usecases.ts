import { DateTime } from "luxon";
import { PartnerEntity } from "@/features/partner/domain/entities/partner";
import { TaxType } from "@/features/tax/domain/enums/tax-type";
import { UseCase } from "@/core/resources/use-case";
import { DataFailed, DataState } from "@/core/resources/data-state";
import { InvoiceRepository } from "@/features/invoice/domain/repositories/invoice";
import { SessionRepository } from "@/features/authentication/domain/repositories/session";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { PaymentGatewayEntity } from "@/features/payment/domain/entities/payment-gateway";
import { ChargeFeeOn } from "@/features/invoice/domain/enums/charge-fee-on";
import { DiscountType } from "@/features/invoice/domain/enums/discount-type";

interface UpdateOutgoingInvoiceItem {
  name: string;
  description?: string;
  qty: number;
  price: number;
  taxType: TaxType;
  taxBase: number;
  tax: number;
  discountType?: DiscountType;
  discount?: number;
  total: number;
}

interface UpdateOutgoingInvoicePaymentConfiguration {
  paymentMethod: PaymentGatewayEntity;
  isEnabled: boolean;
  chargeFeeOn: ChargeFeeOn;
}

interface UpdateOutgoingInvoiceUseCaseParamsConstructor {
  id: string;
  recipient: PartnerEntity;
  invoiceDate: DateTime;
  dueDate: DateTime;
  items: UpdateOutgoingInvoiceItem[];
  note?: string;
  tnc?: string;
  signature?: File;
  paymentConfiguration: UpdateOutgoingInvoicePaymentConfiguration[];
}

export class UpdateOutgoingInvoiceUseCaseParams {
  public id: string;
  public recipient: PartnerEntity;
  public invoiceDate: DateTime;
  public dueDate: DateTime;
  public items: UpdateOutgoingInvoiceItem[];
  public note?: string;
  public tnc?: string;
  public signature?: File;
  public paymentConfiguration: UpdateOutgoingInvoicePaymentConfiguration[];

  constructor(args: UpdateOutgoingInvoiceUseCaseParamsConstructor) {
    this.id = args.id;
    this.recipient = args.recipient;
    this.invoiceDate = args.invoiceDate;
    this.dueDate = args.dueDate;
    this.items = args.items;
    this.note = args.note;
    this.tnc = args.tnc;
    this.signature = args.signature;
    this.paymentConfiguration = args.paymentConfiguration;
  }
}

export class UpdateOutgoingInvoiceUseCase implements UseCase<DataState<boolean>, UpdateOutgoingInvoiceUseCaseParams> {
  constructor(
    private readonly invoiceRepository: InvoiceRepository,
    private readonly sessionRepository: SessionRepository,
  ) {}

  public async execute(params: UpdateOutgoingInvoiceUseCaseParams): Promise<DataState<boolean>> {
    try {
      const session = await this.resolveSession();
      return this.invoiceRepository.updateOutgoing(
        {
          id: params.id,
          recipient: params.recipient,
          invoiceDate: params.invoiceDate,
          dueDate: params.dueDate,
          items: params.items.map((item) => ({
            name: item.name,
            description: item.description,
            qty: item.qty,
            price: item.price,
            taxType: item.taxType,
            taxBase: item.taxBase,
            tax: item.tax,
            discountType: item.discountType,
            discount: item.discount,
            total: item.total,
          })),
          note: params.note,
          tnc: params.tnc,
          signature: params.signature,
          paymentConfiguration: params.paymentConfiguration.map((config) => ({
            paymentMethod: config.paymentMethod,
            isEnabled: config.isEnabled,
            chargeFeeOn: config.chargeFeeOn,
          })),
        },
        session,
      );
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }

  private async resolveSession(): Promise<SessionEntity> {
    const session = await this.sessionRepository.retrieve();
    if (session instanceof DataFailed) throw session.error;
    if (!session.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
    return session.data;
  }
}
