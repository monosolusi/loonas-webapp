import { DateTime } from "luxon";
import { AbstractEntity } from "@/core/resources/entity";
import { ChargeFeeOn } from "@/features/invoice/domain/enums/charge-fee-on";
import { SnapshotPaymentMethodEntity } from "@/features/invoice/domain/entities/snapshot-payment-method";

type InvoicePaymentConfigurationEntityConstructor = {
  id: string;
  paymentMethod: SnapshotPaymentMethodEntity;
  isEnabled: boolean;
  chargeFeeOn: ChargeFeeOn;
  createdAt: DateTime;
  updatedAt: DateTime;
  deletedAt: DateTime | null;
};

export class InvoicePaymentConfigurationEntity implements AbstractEntity {
  public readonly id: string;
  public readonly paymentMethod: SnapshotPaymentMethodEntity;
  public readonly isEnabled: boolean;
  public readonly chargeFeeOn: ChargeFeeOn;
  public readonly createdAt: DateTime;
  public readonly updatedAt: DateTime;
  public readonly deletedAt: DateTime | null;

  constructor(args: InvoicePaymentConfigurationEntityConstructor) {
    this.id = args.id;
    this.paymentMethod = args.paymentMethod;
    this.isEnabled = args.isEnabled;
    this.chargeFeeOn = args.chargeFeeOn;
    this.createdAt = args.createdAt;
    this.updatedAt = args.updatedAt;
    this.deletedAt = args.deletedAt;
  }
}
