import { AbstractEntity } from "@/core/resources/entity";
import { LegalForm } from "@/features/accounting/domain/enums/legal-form";

type AccountSettingEntityConstructor = {
  id: string | null;
  accountId: string;
  legalForm: LegalForm;
  isPkp: boolean;
  npwp: string | null;
  nppkp: string | null;
  pkpEffectiveDate: Date | null;
  isPphFinalUmkm: boolean;
  pphFinalEligibilityStart: Date | null;
  sektorKlbi: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
};

export class AccountSettingEntity implements AbstractEntity {
  public readonly id: string | null;
  public readonly accountId: string;
  public readonly legalForm: LegalForm;
  public readonly isPkp: boolean;
  public readonly npwp: string | null;
  public readonly nppkp: string | null;
  public readonly pkpEffectiveDate: Date | null;
  public readonly isPphFinalUmkm: boolean;
  public readonly pphFinalEligibilityStart: Date | null;
  public readonly sektorKlbi: string | null;
  public readonly createdAt: Date | null;
  public readonly updatedAt: Date | null;

  constructor(args: AccountSettingEntityConstructor) {
    this.id = args.id;
    this.accountId = args.accountId;
    this.legalForm = args.legalForm;
    this.isPkp = args.isPkp;
    this.npwp = args.npwp;
    this.nppkp = args.nppkp;
    this.pkpEffectiveDate = args.pkpEffectiveDate;
    this.isPphFinalUmkm = args.isPphFinalUmkm;
    this.pphFinalEligibilityStart = args.pphFinalEligibilityStart;
    this.sektorKlbi = args.sektorKlbi;
    this.createdAt = args.createdAt;
    this.updatedAt = args.updatedAt;
  }

  public get isNullTriad(): boolean {
    return this.id === null && this.createdAt === null && this.updatedAt === null;
  }
}
