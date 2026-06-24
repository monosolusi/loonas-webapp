import { DateTime } from "luxon";
import { AbstractModel } from "@/core/resources/model";
import { LegalForm } from "@/features/accounting/domain/enums/legal-form";
import { AccountSettingEntity } from "@/features/accounting/domain/entities/account-setting";

export class AccountSettingModel implements AbstractModel {
  constructor(
    public readonly id: string | null,
    public readonly accountId: string,
    public readonly legalForm: LegalForm,
    public readonly isPkp: boolean,
    public readonly npwp: string | null,
    public readonly nppkp: string | null,
    public readonly pkpEffectiveDate: Date | null,
    public readonly isPphFinalUmkm: boolean,
    public readonly pphFinalEligibilityStart: Date | null,
    public readonly sektorKlbi: string | null,
    public readonly createdAt: Date | null,
    public readonly updatedAt: Date | null,
  ) {}

  public static fromJson(data: Record<string, any>): AccountSettingModel {
    const parseDateOrNull = (value: string | null | undefined): Date | null => {
      if (!value) return null;
      const dt = DateTime.fromISO(value);
      return dt.isValid ? dt.toJSDate() : null;
    };

    return new AccountSettingModel(
      data["id"] ?? null,
      data["account_id"] ?? "",
      (data["legal_form"] as LegalForm) ?? LegalForm.SoleProprietor,
      data["is_pkp"] ?? false,
      data["npwp"] ?? null,
      data["nppkp"] ?? null,
      parseDateOrNull(data["pkp_effective_date"]),
      data["is_pph_final_umkm"] ?? true,
      parseDateOrNull(data["pph_final_eligibility_start"]),
      data["sektor_klbi"] ?? null,
      parseDateOrNull(data["created_at"]),
      parseDateOrNull(data["updated_at"]),
    );
  }

  public toEntity(): AccountSettingEntity {
    return new AccountSettingEntity({
      id: this.id,
      accountId: this.accountId,
      legalForm: this.legalForm,
      isPkp: this.isPkp,
      npwp: this.npwp,
      nppkp: this.nppkp,
      pkpEffectiveDate: this.pkpEffectiveDate,
      isPphFinalUmkm: this.isPphFinalUmkm,
      pphFinalEligibilityStart: this.pphFinalEligibilityStart,
      sektorKlbi: this.sektorKlbi,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    });
  }
}
