import { AbstractEntity } from "@/core/resources/entity";
import { CashEntryDirection } from "@/features/accounting/domain/enums/cash-entry-direction";
import { CashEntryStatus } from "@/features/accounting/domain/enums/cash-entry-status";

/**
 * The cash category an entry is classified under. The spec documents `direction` as
 * matching the entry's own `direction`, but that is false for every `status: "cancellation"`
 * row (LNS-762, open). Carry this field because it is wire data — never derive an entry's
 * money-in/money-out reading from it. See `CashEntryEntity.isMoneyIn`.
 */
export type CashEntryCategory = {
  id: string;
  name: string;
  direction: CashEntryDirection;
};

type CashEntryEntityConstructor = {
  id: string;
  direction: CashEntryDirection;
  amount: number;
  category: CashEntryCategory;
  referenceNumber: string;
  status: CashEntryStatus;
  note: string | null;
  entryDate: string;
  journalEntryId: string | null;
  cancelsId: string | null;
  cancelledById: string | null;
  createdByUserId: string;
  createdAt: string;
  updatedAt: string;
};

export class CashEntryEntity implements AbstractEntity {
  public readonly id: string;
  public readonly direction: CashEntryDirection;
  public readonly amount: number;
  public readonly category: CashEntryCategory;
  public readonly referenceNumber: string;
  public readonly status: CashEntryStatus;
  public readonly note: string | null;
  public readonly entryDate: string;
  public readonly journalEntryId: string | null;
  public readonly cancelsId: string | null;
  public readonly cancelledById: string | null;
  public readonly createdByUserId: string;
  public readonly createdAt: string;
  public readonly updatedAt: string;

  constructor(args: CashEntryEntityConstructor) {
    this.id = args.id;
    this.direction = args.direction;
    this.amount = args.amount;
    this.category = args.category;
    this.referenceNumber = args.referenceNumber;
    this.status = args.status;
    this.note = args.note;
    this.entryDate = args.entryDate;
    this.journalEntryId = args.journalEntryId;
    this.cancelsId = args.cancelsId;
    this.cancelledById = args.cancelledById;
    this.createdByUserId = args.createdByUserId;
    this.createdAt = args.createdAt;
    this.updatedAt = args.updatedAt;
  }

  /** True when this entry is itself a mirror-image cancellation entry (`status: "cancellation"`). */
  public get isCancellation(): boolean {
    return this.status === CashEntryStatus.Cancellation;
  }

  /** True when this entry has been cancelled by a later cancellation entry (`status: "cancelled"`). */
  public get isCancelled(): boolean {
    return this.status === CashEntryStatus.Cancelled;
  }

  /** True when this entry is a live, uncancelled entry (`status: "active"`). */
  public get isCurrentlyActive(): boolean {
    return this.status === CashEntryStatus.Active;
  }

  /**
   * Derived from `this.direction` only. `category.direction` is unreliable for cancellation
   * rows (see `CashEntryCategory` doc comment) and must never be consulted here.
   */
  public get isMoneyIn(): boolean {
    return this.direction === CashEntryDirection.In;
  }
}
