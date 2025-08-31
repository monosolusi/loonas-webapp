import { PartnerEntity } from "@/features/partner/domain/entities/partner";
import { DateTime } from "luxon";
import { TaxType } from "@/features/tax/domain/enums/tax-type";
import { UseCase } from "@/core/resources/use-case";
import { DataFailed, DataSuccess } from "@/core/resources/data-state";
import { InvoiceRepository } from "@/features/invoice/domain/repositories/invoice";
import { SessionRepository } from "@/features/authentication/domain/repositories/session";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { OutgoingInvoiceEntity } from "@/features/invoice/domain/entities/outgoing-invoice";
import { PaymentGatewayEntity } from "@/features/payment/domain/entities/payment-gateway";
import { ChargeFeeOn } from "@/features/invoice/domain/enums/charge-fee-on";
import { DiscountType } from "@/features/invoice/domain/enums/discount-type";
import { NotificationChannel } from "@/features/notification/domain/enums/notification-channel";

interface InvoiceItem {
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

interface PaymentConfiguration {
  paymentMethod: PaymentGatewayEntity;
  isEnabled: boolean;
  chargeFeeOn: ChargeFeeOn;
}

interface CreateOutgoingInvoiceUseCaseParamsConstructor {
  recipient: PartnerEntity;
  invoiceNumber: string;
  invoiceDate: DateTime;
  dueDate: DateTime;
  items: InvoiceItem[];
  note?: string;
  tnc?: string;
  signature?: File;
  paymentConfiguration: PaymentConfiguration[];
  sendChannel: NotificationChannel[];
}

export class CreateOutgoingInvoiceUseCaseParams {
  public recipient: PartnerEntity;
  public invoiceNumber: string;
  public invoiceDate: DateTime;
  public dueDate: DateTime;
  public items: InvoiceItem[];
  public note?: string;
  public tnc?: string;
  public signature?: File;
  public paymentConfiguration: PaymentConfiguration[];
  public sendChannel: NotificationChannel[];

  constructor(args: CreateOutgoingInvoiceUseCaseParamsConstructor) {
    this.recipient = args.recipient;
    this.invoiceNumber = args.invoiceNumber;
    this.invoiceDate = args.invoiceDate;
    this.dueDate = args.dueDate;
    this.items = args.items;
    this.note = args.note;
    this.tnc = args.tnc;
    this.signature = args.signature;
    this.paymentConfiguration = args.paymentConfiguration;
    this.sendChannel = args.sendChannel;
  }
}

export class CreateOutgoingInvoiceUseCase
  implements UseCase<DataSuccess<OutgoingInvoiceEntity>, CreateOutgoingInvoiceUseCaseParams>
{
  constructor(
    private readonly invoiceRepository: InvoiceRepository,
    private readonly sesssionRepository: SessionRepository,
  ) {}

  public async execute(params: CreateOutgoingInvoiceUseCaseParams): Promise<DataSuccess<OutgoingInvoiceEntity>> {
    try {
      const session = await this.sesssionRepository.retrieve();
      if (session instanceof DataFailed) return session;
      if (!session.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

      const invoice = await this.invoiceRepository.createOutgoing(
        {
          recipient: params.recipient,
          invoiceNumber: params.invoiceNumber,
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
          sendChannel: params.sendChannel,
        },
        session.data,
      );

      if (invoice instanceof DataFailed) throw invoice.error;
      return invoice;
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }
}
