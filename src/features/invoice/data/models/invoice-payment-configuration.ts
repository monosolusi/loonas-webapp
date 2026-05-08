import { DateTime } from "luxon";
import { AbstractModel } from "@/core/resources/model";
import { ChargeFeeOn } from "@/features/invoice/domain/enums/charge-fee-on";
import { InvoicePaymentConfigurationEntity } from "@/features/invoice/domain/entities/invoice-payment-configuration";
import { SnapshotPaymentMethodModel } from "@/features/invoice/data/models/snapshot-payment-method";

type InvoicePaymentConfigurationModelConstructor = {
  id: string;
  paymentMethod: SnapshotPaymentMethodModel;
  isEnabled: boolean;
  chargeFeeOn: ChargeFeeOn;
  createdAt: DateTime;
  updatedAt: DateTime;
  deletedAt: DateTime | null;
};

function parseChargeFeeOn(raw: unknown): ChargeFeeOn {
  if (typeof raw === "string" && (Object.values(ChargeFeeOn) as string[]).includes(raw)) {
    return raw as ChargeFeeOn;
  }
  return ChargeFeeOn.INVOICE_SENDER;
}

export class InvoicePaymentConfigurationModel implements AbstractModel {
  public readonly id: string;
  public readonly paymentMethod: SnapshotPaymentMethodModel;
  public readonly isEnabled: boolean;
  public readonly chargeFeeOn: ChargeFeeOn;
  public readonly createdAt: DateTime;
  public readonly updatedAt: DateTime;
  public readonly deletedAt: DateTime | null;

  constructor(args: InvoicePaymentConfigurationModelConstructor) {
    this.id = args.id;
    this.paymentMethod = args.paymentMethod;
    this.isEnabled = args.isEnabled;
    this.chargeFeeOn = args.chargeFeeOn;
    this.createdAt = args.createdAt;
    this.updatedAt = args.updatedAt;
    this.deletedAt = args.deletedAt;
  }

  public static fromJson(doc: Record<string, any>): InvoicePaymentConfigurationModel {
    return new InvoicePaymentConfigurationModel({
      id: doc["id"] ?? "",
      paymentMethod: SnapshotPaymentMethodModel.fromJson(doc["payment_method"] ?? {}),
      isEnabled: doc["is_enabled"] === true,
      chargeFeeOn: parseChargeFeeOn(doc["charge_fee_on"]),
      createdAt: DateTime.fromISO(doc["created_at"] ?? ""),
      updatedAt: DateTime.fromISO(doc["updated_at"] ?? ""),
      deletedAt: typeof doc["deleted_at"] === "string" ? DateTime.fromISO(doc["deleted_at"]) : null,
    });
  }

  public toEntity(): InvoicePaymentConfigurationEntity {
    return new InvoicePaymentConfigurationEntity({
      id: this.id,
      paymentMethod: this.paymentMethod.toEntity(),
      isEnabled: this.isEnabled,
      chargeFeeOn: this.chargeFeeOn,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      deletedAt: this.deletedAt,
    });
  }
}
