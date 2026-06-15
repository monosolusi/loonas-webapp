import { DataState } from "@/core/resources/data-state";
import { PaginationMeta } from "@/core/resources/paginated";
import { SessionEntity } from "@/features/authentication/domain/entities/session";

export type GetNeracaRepoParams = {
  readonly asOf: string;
  readonly compareTo?: string;
};

export type GetLabaRugiRepoParams = {
  readonly from: string;
  readonly to: string;
  readonly compareFrom?: string;
  readonly compareTo?: string;
};

export type GetArusKasRepoParams = {
  readonly from: string;
  readonly to: string;
};

export type GetTrialBalanceRepoParams = {
  readonly asOf: string;
  readonly includeZero?: boolean;
};

export type GetGeneralLedgerRepoParams = {
  readonly accountId: string;
  readonly from: string;
  readonly to: string;
  readonly page?: number;
  readonly limit?: number;
};

export type GetCalkRepoParams = {
  readonly asOf: string;
};

export type NeracaReportData = { readonly data: Record<string, any> };
export type LabaRugiReportData = { readonly data: Record<string, any> };
export type ArusKasReportData = { readonly data: Record<string, any> };
export type TrialBalanceReportData = { readonly data: Record<string, any> };
export type GeneralLedgerReportData = {
  readonly data: Record<string, any>;
  readonly meta: PaginationMeta;
};
export type CalkReportData = { readonly data: Record<string, any> };

export interface ReportRepository {
  getNeraca(params: GetNeracaRepoParams, session: SessionEntity): Promise<DataState<NeracaReportData>>;
  getLabaRugi(params: GetLabaRugiRepoParams, session: SessionEntity): Promise<DataState<LabaRugiReportData>>;
  getArusKas(params: GetArusKasRepoParams, session: SessionEntity): Promise<DataState<ArusKasReportData>>;
  getTrialBalance(params: GetTrialBalanceRepoParams, session: SessionEntity): Promise<DataState<TrialBalanceReportData>>;
  getGeneralLedger(
    params: GetGeneralLedgerRepoParams,
    session: SessionEntity,
  ): Promise<DataState<GeneralLedgerReportData>>;
  getCalk(params: GetCalkRepoParams, session: SessionEntity): Promise<DataState<CalkReportData>>;
}
