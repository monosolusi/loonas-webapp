import { AbstractEntity } from "@/core/resources/entity";
import { PayInReferenceType } from "@/features/invoice/domain/enums/pay-in-reference-type";
import { PaymentMethodPayInDetailEntity } from "@/features/invoice/domain/entities/pay-in-detail/payment-method-pay-in-detail";

type PayInDetailEntityConstructor = {
  id: string;
  referenceType: PayInReferenceType;
  paymentMethodId: string;
  detail: PaymentMethodPayInDetailEntity | null;
};

export class PayInDetailEntity implements AbstractEntity {
  public readonly id: string;
  public readonly referenceType: PayInReferenceType;
  public readonly paymentMethodId: string;
  public readonly detail: PaymentMethodPayInDetailEntity | null;

  constructor(args: PayInDetailEntityConstructor) {
    this.id = args.id;
    this.referenceType = args.referenceType;
    this.paymentMethodId = args.paymentMethodId;
    this.detail = args.detail;
  }
}
