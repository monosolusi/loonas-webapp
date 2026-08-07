import { DataState } from "@/core/resources/data-state";
import { PaginationMeta } from "@/core/resources/paginated";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { BalanceSheetReportEntity } from "@/features/accounting/domain/entities/balance-sheet";
import { IncomeStatementReportEntity } from "@/features/accounting/domain/entities/income-statement";
import { CashFlowReportEntity } from "@/features/accounting/domain/entities/cash-flow";
import { TrialBalanceReportEntity } from "@/features/accounting/domain/entities/trial-balance";
import { TrialBalanceLineEntity } from "@/features/accounting/domain/entities/trial-balance-line";
import { GeneralLedgerReportEntity } from "@/features/accounting/domain/entities/general-ledger";
import { NotesReportEntity } from "@/features/accounting/domain/entities/notes";
import { CostValuationGapRowEntity } from "@/features/accounting/domain/entities/cost-valuation-gap";

export type GetBalanceSheetRepoParams = {
  readonly asOf: string;
  readonly compareTo?: string;
};

export type GetIncomeStatementRepoParams = {
  readonly from: string;
  readonly to: string;
  readonly compareFrom?: string;
  readonly compareTo?: string;
};

export type GetCashFlowRepoParams = {
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

export type GetNotesRepoParams = {
  readonly asOf: string;
};

export type ListTrialBalanceLinesRepoParams = {
  readonly accountId: string;
  readonly from?: string;
  readonly to?: string;
  readonly page?: number;
  readonly limit?: number;
};

export type ListCostValuationGapsRepoParams = {
  readonly from?: string;
  readonly to?: string;
  readonly page?: number;
  readonly limit?: number;
};

export type BalanceSheetReportData = BalanceSheetReportEntity;
export type IncomeStatementReportData = IncomeStatementReportEntity;
export type CashFlowReportData = CashFlowReportEntity;
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
export type CostValuationGapsData = {
  readonly rows: CostValuationGapRowEntity[];
  readonly meta: PaginationMeta;
};
export type NotesReportData = NotesReportEntity;

export interface ReportRepository {
  getBalanceSheet(params: GetBalanceSheetRepoParams, session: SessionEntity): Promise<DataState<BalanceSheetReportData>>;
  getIncomeStatement(
    params: GetIncomeStatementRepoParams,
    session: SessionEntity,
  ): Promise<DataState<IncomeStatementReportData>>;
  getCashFlow(params: GetCashFlowRepoParams, session: SessionEntity): Promise<DataState<CashFlowReportData>>;
  getTrialBalance(params: GetTrialBalanceRepoParams, session: SessionEntity): Promise<DataState<TrialBalanceReportData>>;
  getGeneralLedger(
    params: GetGeneralLedgerRepoParams,
    session: SessionEntity,
  ): Promise<DataState<GeneralLedgerReportData>>;
  getNotes(params: GetNotesRepoParams, session: SessionEntity): Promise<DataState<NotesReportData>>;
  listTrialBalanceLines(
    params: ListTrialBalanceLinesRepoParams,
    session: SessionEntity,
  ): Promise<DataState<TrialBalanceLinesData>>;
  listCostValuationGaps(
    params: ListCostValuationGapsRepoParams,
    session: SessionEntity,
  ): Promise<DataState<CostValuationGapsData>>;
}
