import { DateTime } from "luxon";
import { HttpRequest } from "@/core/helpers/http-request";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { AccountSettingModel } from "@/features/accounting/data/models/account-setting";
import { AccountSettingService, UpdateAccountSettingServiceParams } from "@/features/accounting/domain/sources/account-setting";

export class AccountSettingServiceImpl implements AccountSettingService {
  constructor(private readonly http: HttpRequest) {}

  public async get(session: SessionEntity): Promise<AccountSettingModel> {
    try {
      const result = await this.http.request({ path: "/accounting/account-settings", method: "GET", session });
      if (!result?.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
      return AccountSettingModel.fromJson(result.data);
    } catch (err) {
      if (err instanceof ServerError) throw err;
      else throw new ServerError(ErrorCodes.UNKNOWN, { error: err });
    }
  }

  public async update(params: UpdateAccountSettingServiceParams, session: SessionEntity): Promise<AccountSettingModel> {
    try {
      const body: Record<string, any> = {};

      if (params.legalForm !== undefined) body["legal_form"] = params.legalForm;
      if (params.npwp !== undefined) body["npwp"] = params.npwp;
      if (params.nppkp !== undefined) body["nppkp"] = params.nppkp;
      if (params.isPphFinalUmkm !== undefined) body["is_pph_final_umkm"] = params.isPphFinalUmkm;
      if (params.sektorKlbi !== undefined) body["sektor_klbi"] = params.sektorKlbi;

      // Date fields: send YYYY-MM-DD or null — never the raw ISO datetime from GET
      if (params.pkpEffectiveDate !== undefined) {
        body["pkp_effective_date"] =
          params.pkpEffectiveDate != null
            ? DateTime.fromISO(params.pkpEffectiveDate).toISODate()
            : null;
      }
      if (params.pphFinalEligibilityStart !== undefined) {
        body["pph_final_eligibility_start"] =
          params.pphFinalEligibilityStart != null
            ? DateTime.fromISO(params.pphFinalEligibilityStart).toISODate()
            : null;
      }

      const result = await this.http.request({ path: "/accounting/account-settings", method: "PATCH", body, session });
      if (!result?.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
      return AccountSettingModel.fromJson(result.data);
    } catch (err) {
      if (err instanceof ServerError) throw err;
      else throw new ServerError(ErrorCodes.UNKNOWN, { error: err });
    }
  }
}
