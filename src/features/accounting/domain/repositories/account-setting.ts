import { DataState } from "@/core/resources/data-state";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { AccountSettingEntity } from "@/features/accounting/domain/entities/account-setting";
import { LegalForm } from "@/features/accounting/domain/enums/legal-form";

export type UpdateAccountSettingParams = {
  legalForm?: LegalForm;
  npwp?: string | null;
  nppkp?: string | null;
  pkpEffectiveDate?: string | null;
  isPphFinalUmkm?: boolean;
  pphFinalEligibilityStart?: string | null;
  sektorKlbi?: string | null;
};

export interface AccountSettingRepository {
  get(session: SessionEntity): Promise<DataState<AccountSettingEntity>>;
  update(params: UpdateAccountSettingParams, session: SessionEntity): Promise<DataState<AccountSettingEntity>>;
}
