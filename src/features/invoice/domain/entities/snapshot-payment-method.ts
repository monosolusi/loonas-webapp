import { AbstractEntity } from "@/core/resources/entity";
import { PayInType } from "@/features/invoice/domain/enums/pay-in-type";
import { PaymentSchemeEntity } from "@/features/payment/domain/entities/payment-scheme";

type SnapshotPaymentMethodEntityConstructor = {
  id: string;
  originalId: string;
  title: string;
  description: string;
  isActive: boolean;
  baseFee: number;
  percentageFee: number;
  requiresSchemeSelection: boolean;
  schemes: PaymentSchemeEntity[];
  type: PayInType;
};

export class SnapshotPaymentMethodEntity implements AbstractEntity {
  public readonly id: string;
  public readonly originalId: string;
  public readonly title: string;
  public readonly description: string;
  public readonly isActive: boolean;
  public readonly baseFee: number;
  public readonly percentageFee: number;
  public readonly requiresSchemeSelection: boolean;
  public readonly schemes: PaymentSchemeEntity[];
  public readonly type: PayInType;

  constructor(args: SnapshotPaymentMethodEntityConstructor) {
    this.id = args.id;
    this.originalId = args.originalId;
    this.title = args.title;
    this.description = args.description;
    this.isActive = args.isActive;
    this.baseFee = args.baseFee;
    this.percentageFee = args.percentageFee;
    this.requiresSchemeSelection = args.requiresSchemeSelection;
    this.schemes = args.schemes;
    this.type = args.type;
  }
}
