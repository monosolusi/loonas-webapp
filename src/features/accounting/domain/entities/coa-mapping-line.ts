import { AbstractEntity } from "@/core/resources/entity";
import { LedgerAccountEntity } from "@/features/accounting/domain/entities/ledger-account";

export type CoaMappingLinePosition = "debit" | "credit";

type CoaMappingLineEntityConstructor = {
  id: string;
  account: LedgerAccountEntity;
  position: CoaMappingLinePosition;
  label: string | null;
  sortOrder: number;
};

export class CoaMappingLineEntity implements AbstractEntity {
  public readonly id: string;
  public readonly account: LedgerAccountEntity;
  public readonly position: CoaMappingLinePosition;
  public readonly label: string | null;
  public readonly sortOrder: number;

  constructor(args: CoaMappingLineEntityConstructor) {
    this.id = args.id;
    this.account = args.account;
    this.position = args.position;
    this.label = args.label;
    this.sortOrder = args.sortOrder;
  }
}
