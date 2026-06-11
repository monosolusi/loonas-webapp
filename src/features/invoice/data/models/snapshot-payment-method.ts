import { AbstractModel } from "@/core/resources/model";
import { PayInType } from "@/features/invoice/domain/enums/pay-in-type";
import { SnapshotPaymentMethodEntity } from "@/features/invoice/domain/entities/snapshot-payment-method";
import { PaymentSchemeModel } from "@/features/payment/data/models/payment-scheme";

type SnapshotPaymentMethodModelConstructor = {
  id: string;
  originalId: string;
  title: string;
  description: string;
  isActive: boolean;
  baseFee: number;
  percentageFee: number;
  requiresSchemeSelection: boolean;
  schemes: PaymentSchemeModel[];
  type: PayInType;
};

function parseType(raw: unknown): PayInType {
  if (typeof raw === "string" && (Object.values(PayInType) as string[]).includes(raw)) {
    return raw as PayInType;
  }
  return PayInType.CASH;
}

export class SnapshotPaymentMethodModel implements AbstractModel {
  public readonly id: string;
  public readonly originalId: string;
  public readonly title: string;
  public readonly description: string;
  public readonly isActive: boolean;
  public readonly baseFee: number;
  public readonly percentageFee: number;
  public readonly requiresSchemeSelection: boolean;
  public readonly schemes: PaymentSchemeModel[];
  public readonly type: PayInType;

  constructor(args: SnapshotPaymentMethodModelConstructor) {
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

  public static fromJson(doc: Record<string, any>): SnapshotPaymentMethodModel {
    const rawSchemes = doc["schemes"];
    return new SnapshotPaymentMethodModel({
      id: doc["id"] ?? "",
      originalId: doc["original_id"] ?? "",
      title: doc["title"] ?? "",
      description: doc["description"] ?? "",
      isActive: doc["is_active"] === true,
      baseFee: typeof doc["base_fee"] === "number" ? doc["base_fee"] : 0,
      percentageFee: typeof doc["percentage_fee"] === "number" ? doc["percentage_fee"] : 0,
      requiresSchemeSelection: doc["requires_scheme_selection"] === true,
      schemes: Array.isArray(rawSchemes) ? rawSchemes.map(PaymentSchemeModel.fromJson) : [],
      type: parseType(doc["type"]),
    });
  }

  public toEntity(): SnapshotPaymentMethodEntity {
    return new SnapshotPaymentMethodEntity({
      id: this.id,
      originalId: this.originalId,
      title: this.title,
      description: this.description,
      isActive: this.isActive,
      baseFee: this.baseFee,
      percentageFee: this.percentageFee,
      requiresSchemeSelection: this.requiresSchemeSelection,
      schemes: this.schemes.map((s) => s.toEntity()),
      type: this.type,
    });
  }
}
