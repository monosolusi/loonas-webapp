import { PaginationMeta } from "@/core/resources/paginated";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { CostValuationGapRowModel } from "@/features/accounting/data/models/cost-valuation-gap";

export type ListCostValuationGapsParams = {
  readonly from?: string;
  readonly to?: string;
  readonly page?: number;
  readonly limit?: number;
};

export type ListCostValuationGapsServiceResult = {
  readonly data: CostValuationGapRowModel[];
  readonly meta: PaginationMeta;
};

export type ListTrialBalanceLinesParams = {
  readonly accountId: string;
  readonly from?: string;
  readonly to?: string;
  readonly page?: number;
  readonly limit?: number;
};

export type ListTrialBalanceLinesServiceResult = {
  readonly data: Record<string, any>[];
  readonly counterparts: Record<string, any>[];
  readonly meta: PaginationMeta;
};

export type GetBalanceSheetParams = {
  readonly asOf: string;
  readonly compareTo?: string;
};

export type GetIncomeStatementParams = {
  readonly from: string;
  readonly to: string;
  readonly compareFrom?: string;
  readonly compareTo?: string;
};

export type GetCashFlowParams = {
  readonly from: string;
  readonly to: string;
};

export type GetTrialBalanceParams = {
  readonly asOf: string;
  readonly includeZero?: boolean;
};

export type GetGeneralLedgerParams = {
  readonly accountId: string;
  readonly from: string;
  readonly to: string;
  readonly page?: number;
  readonly limit?: number;
};

export type GetNotesParams = {
  readonly asOf: string;
};

export type GetBalanceSheetServiceResult = { readonly data: Record<string, any> };
export type GetIncomeStatementServiceResult = { readonly data: Record<string, any> };
export type GetCashFlowServiceResult = { readonly data: Record<string, any> };
export type GetTrialBalanceServiceResult = { readonly data: Record<string, any> };
export type GetGeneralLedgerServiceResult = {
  readonly data: Record<string, any>;
  readonly meta: PaginationMeta;
};
export type GetNotesServiceResult = { readonly data: Record<string, any> };

export interface ReportService {
  getBalanceSheet(params: GetBalanceSheetParams, session: SessionEntity): Promise<GetBalanceSheetServiceResult>;
  getIncomeStatement(params: GetIncomeStatementParams, session: SessionEntity): Promise<GetIncomeStatementServiceResult>;
  getCashFlow(params: GetCashFlowParams, session: SessionEntity): Promise<GetCashFlowServiceResult>;
  getTrialBalance(params: GetTrialBalanceParams, session: SessionEntity): Promise<GetTrialBalanceServiceResult>;
  getGeneralLedger(params: GetGeneralLedgerParams, session: SessionEntity): Promise<GetGeneralLedgerServiceResult>;
  getNotes(params: GetNotesParams, session: SessionEntity): Promise<GetNotesServiceResult>;
  listTrialBalanceLines(
    params: ListTrialBalanceLinesParams,
    session: SessionEntity,
  ): Promise<ListTrialBalanceLinesServiceResult>;
  listCostValuationGaps(
    params: ListCostValuationGapsParams,
    session: SessionEntity,
  ): Promise<ListCostValuationGapsServiceResult>;
}
