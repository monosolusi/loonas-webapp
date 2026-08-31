import { AbstractModel } from "@/core/resources/model";
import { MovementDirectionType } from "@/features/balance/domain/enums/movement-direction";
import { SourceRefTypeType } from "@/features/balance/domain/enums/source-ref-type";
import { BalanceMovementEntity } from "@/features/balance/domain/entities/balance-movement";

type BalanceMovementModelConstructor = {
  id: string;
  direction: MovementDirectionType;
  amount: number;
  currency: string;
  sourceRefType: SourceRefTypeType;
  sourceRefId: string;
  correctsMovementId: string | null;
  createdAt: string;
};

export class BalanceMovementModel implements AbstractModel {
  public readonly id: string;
  public readonly direction: MovementDirectionType;
  public readonly amount: number;
  public readonly currency: string;
  public readonly sourceRefType: SourceRefTypeType;
  public readonly sourceRefId: string;
  public readonly correctsMovementId: string | null;
  public readonly createdAt: string;

  constructor(args: BalanceMovementModelConstructor) {
    this.id = args.id;
    this.direction = args.direction;
    this.amount = args.amount;
    this.currency = args.currency;
    this.sourceRefType = args.sourceRefType;
    this.sourceRefId = args.sourceRefId;
    this.correctsMovementId = args.correctsMovementId;
    this.createdAt = args.createdAt;
  }

  public static fromJson(data: Record<string, any>): BalanceMovementModel {
    return new BalanceMovementModel({
      id: data["id"],
      direction: data["direction"],
      // Always positive on the wire (`CHECK (amount > 0)`); the sign lives in `direction`,
      // so no defaulting and no sign adjustment here.
      amount: data["amount"],
      currency: data["currency"],
      sourceRefType: data["source_ref_type"],
      sourceRefId: data["source_ref_id"],
      // `null` is a real value (an ordinary movement), distinct from a corrected one — never
      // collapse it to 0 or "".
      correctsMovementId: data["corrects_movement_id"] ?? null,
      createdAt: data["created_at"],
    });
  }

  public toEntity(): BalanceMovementEntity {
    return new BalanceMovementEntity({
      id: this.id,
      direction: this.direction,
      amount: this.amount,
      currency: this.currency,
      sourceRefType: this.sourceRefType,
      sourceRefId: this.sourceRefId,
      correctsMovementId: this.correctsMovementId,
      createdAt: this.createdAt,
    });
  }
}
