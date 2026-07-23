import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { AccountSettingModel } from "@/features/accounting/data/models/account-setting";
import { LegalForm } from "@/features/accounting/domain/enums/legal-form";

export type UpdateAccountSettingServiceParams = {
  legalForm?: LegalForm;
  npwp?: string | null;
  nppkp?: string | null;
  pkpEffectiveDate?: string | null;
  isPphFinalUmkm?: boolean;
  pphFinalEligibilityStart?: string | null;
  sektorKlbi?: string | null;
};

export interface AccountSettingService {
  get(session: SessionEntity): Promise<AccountSettingModel>;
  update(params: UpdateAccountSettingServiceParams, session: SessionEntity): Promise<AccountSettingModel>;
}
