import { AbstractEntity } from "@/core/resources/entity";
import { CashCategoryEntity } from "@/features/accounting/domain/entities/cash-category";
import { CashEntryDirection } from "@/features/accounting/domain/enums/cash-entry-direction";
import { CashEntryStatus } from "@/features/accounting/domain/enums/cash-entry-status";

type CashEntryEntityConstructor = {
  id: string;
  direction: CashEntryDirection;
  amount: number;
  category: CashCategoryEntity;
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
  /**
   * The cash category this entry is classified under. The spec documents its `direction` as
   * matching the entry's own `direction`, but that is false for every `status: "cancellation"`
   * row (LNS-762, open) — it is wire data, never a basis for deriving an entry's
   * money-in/money-out reading. See `CashEntryEntity.isMoneyIn`.
   */
  public readonly category: CashCategoryEntity;
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
   * rows (see `category`'s doc comment) and must never be consulted here.
   */
  public get isMoneyIn(): boolean {
    return this.direction === CashEntryDirection.In;
  }
}
