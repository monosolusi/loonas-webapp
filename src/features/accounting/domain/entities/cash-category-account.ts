import { AbstractEntity } from "@/core/resources/entity";

type CashCategoryAccountEntityConstructor = {
  id: string;
  code: string;
  name: string;
};

/**
 * The CoA account a category posts to. The live spec declares only these three fields on the
 * inline `account` object — no `type` — so eligibility is resolved through the category's own
 * `direction` (`cash-category-eligibility.ts`), never re-derived here.
 */
export class CashCategoryAccountEntity implements AbstractEntity {
  public readonly id: string;
  public readonly code: string;
  public readonly name: string;

  constructor(args: CashCategoryAccountEntityConstructor) {
    this.id = args.id;
    this.code = args.code;
    this.name = args.name;
  }
}
