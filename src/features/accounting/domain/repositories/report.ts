import { DataState } from "@/core/resources/data-state";
import { PaginationMeta } from "@/core/resources/paginated";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { NeracaReportEntity } from "@/features/accounting/domain/entities/neraca";
import { LabaRugiReportEntity } from "@/features/accounting/domain/entities/laba-rugi";
import { ArusKasReportEntity } from "@/features/accounting/domain/entities/arus-kas";
import { TrialBalanceReportEntity } from "@/features/accounting/domain/entities/trial-balance";
import { TrialBalanceLineEntity } from "@/features/accounting/domain/entities/trial-balance-line";
import { GeneralLedgerReportEntity } from "@/features/accounting/domain/entities/general-ledger";
import { CalkReportEntity } from "@/features/accounting/domain/entities/calk";

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

export type ListTrialBalanceLinesRepoParams = {
  readonly accountId: string;
  readonly from?: string;
  readonly to?: string;
  readonly page?: number;
  readonly limit?: number;
};

export type NeracaReportData = NeracaReportEntity;
export type LabaRugiReportData = LabaRugiReportEntity;
export type ArusKasReportData = ArusKasReportEntity;
export type TrialBalanceReportData = TrialBalanceReportEntity;
export type GeneralLedgerReportData = {
  readonly data: GeneralLedgerReportEntity;
  readonly meta: PaginationMeta;
};
export type TrialBalanceLinesData = {
  readonly lines: TrialBalanceLineEntity[];
  readonly counterparts: TrialBalanceLineEntity[];
  readonly meta: PaginationMeta;
};
export type CalkReportData = CalkReportEntity;

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
  listTrialBalanceLines(
    params: ListTrialBalanceLinesRepoParams,
    session: SessionEntity,
  ): Promise<DataState<TrialBalanceLinesData>>;
}
