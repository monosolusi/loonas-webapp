import { AbstractEntity } from "@/core/resources/entity";
import { CashEntryDirection } from "@/features/accounting/domain/enums/cash-entry-direction";

/**
 * The CoA account a category posts to. The live spec declares only these three fields on the
 * inline `account` object — no `type` — so eligibility is resolved through the category's own
 * `direction` (`cash-category-eligibility.ts`), never re-derived here.
 */
export type CashCategoryAccount = {
  id: string;
  code: string;
  name: string;
};

type CashCategoryEntityConstructor = {
  id: string;
  direction: CashEntryDirection;
  name: string;
  account: CashCategoryAccount;
  isCurated: boolean;
  createdAt: string;
  updatedAt: string;
};

export class CashCategoryEntity implements AbstractEntity {
  public readonly id: string;
  public readonly direction: CashEntryDirection;
  public readonly name: string;
  public readonly account: CashCategoryAccount;
  public readonly isCurated: boolean;
  public readonly createdAt: string;
  public readonly updatedAt: string;

  constructor(args: CashCategoryEntityConstructor) {
    this.id = args.id;
    this.direction = args.direction;
    this.name = args.name;
    this.account = args.account;
    this.isCurated = args.isCurated;
    this.createdAt = args.createdAt;
    this.updatedAt = args.updatedAt;
  }
}
