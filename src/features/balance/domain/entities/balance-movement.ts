import { AbstractEntity } from "@/core/resources/entity";
import { MovementDirection, MovementDirectionType } from "@/features/balance/domain/enums/movement-direction";
import { SourceRefTypeType } from "@/features/balance/domain/enums/source-ref-type";

type BalanceMovementEntityConstructor = {
  id: string;
  direction: MovementDirectionType;
  amount: number;
  currency: string;
  sourceRefType: SourceRefTypeType;
  sourceRefId: string;
  correctsMovementId: string | null;
  createdAt: string;
};

export class BalanceMovementEntity implements AbstractEntity {
  public readonly id: string;
  public readonly direction: MovementDirectionType;
  public readonly amount: number;
  public readonly currency: string;
  public readonly sourceRefType: SourceRefTypeType;
  public readonly sourceRefId: string;
  public readonly correctsMovementId: string | null;
  public readonly createdAt: string;

  constructor(args: BalanceMovementEntityConstructor) {
    this.id = args.id;
    this.direction = args.direction;
    this.amount = args.amount;
    this.currency = args.currency;
    this.sourceRefType = args.sourceRefType;
    this.sourceRefId = args.sourceRefId;
    this.correctsMovementId = args.correctsMovementId;
    this.createdAt = args.createdAt;
  }

  // Exactly two derived getters, deliberately. There is no `isDebit`: call sites branch on
  // `!isCredit`, so a second getter would only restate the complement and drift (CLAUDE.md
  // derived-invariant rule).
  get isCredit(): boolean {
    return this.direction === MovementDirection.CREDIT;
  }

  get isCorrection(): boolean {
    return this.correctsMovementId !== null;
  }
}
