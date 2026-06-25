import { CloseWarning, PphFinalWarningDetails } from "@/features/accounting/domain/entities/close-warning";

export class CloseWarningModel {
  public static fromJson(data: Record<string, any>): CloseWarning {
    let details: PphFinalWarningDetails | null = null;
    if (data["details"]) {
      const d = data["details"];
      details = {
        period: d["period"] ?? "",
        tenantRegime: d["tenant_regime"] ?? "",
        expectedAccountCode: d["expected_account_code"] ?? "",
        periodDpp: d["period_dpp"] ?? 0,
        setorDeadline: d["setor_deadline"] ?? "",
      };
    }
    return {
      code: data["code"] ?? "",
      message: data["message"] ?? "",
      details,
    };
  }
}
