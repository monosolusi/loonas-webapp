import { PaginationMeta } from "@/core/resources/paginated";
import { SessionEntity } from "@/features/authentication/domain/entities/session";

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

export type GetNeracaParams = {
  readonly asOf: string;
  readonly compareTo?: string;
};

export type GetLabaRugiParams = {
  readonly from: string;
  readonly to: string;
  readonly compareFrom?: string;
  readonly compareTo?: string;
};

export type GetArusKasParams = {
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

export type GetCalkParams = {
  readonly asOf: string;
};

export type GetNeracaServiceResult = { readonly data: Record<string, any> };
export type GetLabaRugiServiceResult = { readonly data: Record<string, any> };
export type GetArusKasServiceResult = { readonly data: Record<string, any> };
export type GetTrialBalanceServiceResult = { readonly data: Record<string, any> };
export type GetGeneralLedgerServiceResult = {
  readonly data: Record<string, any>;
  readonly meta: PaginationMeta;
};
export type GetCalkServiceResult = { readonly data: Record<string, any> };

export interface ReportService {
  getNeraca(params: GetNeracaParams, session: SessionEntity): Promise<GetNeracaServiceResult>;
  getLabaRugi(params: GetLabaRugiParams, session: SessionEntity): Promise<GetLabaRugiServiceResult>;
  getArusKas(params: GetArusKasParams, session: SessionEntity): Promise<GetArusKasServiceResult>;
  getTrialBalance(params: GetTrialBalanceParams, session: SessionEntity): Promise<GetTrialBalanceServiceResult>;
  getGeneralLedger(params: GetGeneralLedgerParams, session: SessionEntity): Promise<GetGeneralLedgerServiceResult>;
  getCalk(params: GetCalkParams, session: SessionEntity): Promise<GetCalkServiceResult>;
  listTrialBalanceLines(
    params: ListTrialBalanceLinesParams,
    session: SessionEntity,
  ): Promise<ListTrialBalanceLinesServiceResult>;
}
