import { AbstractEntity } from "@/core/resources/entity";
import { CashCategoryAccountEntity } from "@/features/accounting/domain/entities/cash-category-account";
import { CashEntryDirection } from "@/features/accounting/domain/enums/cash-entry-direction";

type CashCategoryEntityConstructor = {
  id: string;
  direction: CashEntryDirection;
  name: string;
  account: CashCategoryAccountEntity;
  isCurated: boolean;
  createdAt: string;
  updatedAt: string;
};

export class CashCategoryEntity implements AbstractEntity {
  public readonly id: string;
  public readonly direction: CashEntryDirection;
  public readonly name: string;
  /** The CoA account this category posts to — see `CashCategoryAccountEntity` for its wire shape. */
  public readonly account: CashCategoryAccountEntity;
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
