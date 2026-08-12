import { DataFailed, DataState, DataSuccess } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import {
  ReportRepository,
  GetBalanceSheetRepoParams,
  GetIncomeStatementRepoParams,
  GetCashFlowRepoParams,
  GetTrialBalanceRepoParams,
  GetGeneralLedgerRepoParams,
  GetNotesRepoParams,
  ListTrialBalanceLinesRepoParams,
  ListCostValuationGapsRepoParams,
  BalanceSheetReportData,
  IncomeStatementReportData,
  CashFlowReportData,
  TrialBalanceReportData,
  GeneralLedgerReportData,
  TrialBalanceLinesData,
  CostValuationGapsData,
  NotesReportData,
} from "@/features/accounting/domain/repositories/report";
import { ReportService } from "@/features/accounting/domain/sources/report";
import { BalanceSheetModel } from "@/features/accounting/data/models/balance-sheet";
import { IncomeStatementModel } from "@/features/accounting/data/models/income-statement";
import { CashFlowModel } from "@/features/accounting/data/models/cash-flow";
import { TrialBalanceReportModel } from "@/features/accounting/data/models/trial-balance";
import { TrialBalanceLineModel } from "@/features/accounting/data/models/trial-balance-line";
import { GeneralLedgerReportModel } from "@/features/accounting/data/models/general-ledger";
import { NotesModel } from "@/features/accounting/data/models/notes";

export class ReportRepositoryImpl implements ReportRepository {
  constructor(private readonly service: ReportService) {}

  public async getBalanceSheet(
    params: GetBalanceSheetRepoParams,
    session: SessionEntity,
  ): Promise<DataState<BalanceSheetReportData>> {
    try {
      const result = await this.service.getBalanceSheet(params, session);
      const model = BalanceSheetModel.fromJson(result.data);
      return new DataSuccess(model.toEntity());
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }

  public async getIncomeStatement(
    params: GetIncomeStatementRepoParams,
    session: SessionEntity,
  ): Promise<DataState<IncomeStatementReportData>> {
    try {
      const result = await this.service.getIncomeStatement(params, session);
      const model = IncomeStatementModel.fromJson(result.data);
      return new DataSuccess(model.toEntity());
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }

  public async getCashFlow(params: GetCashFlowRepoParams, session: SessionEntity): Promise<DataState<CashFlowReportData>> {
    try {
      const result = await this.service.getCashFlow(params, session);
      const model = CashFlowModel.fromJson(result.data);
      return new DataSuccess(model.toEntity());
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }

  public async getTrialBalance(
    params: GetTrialBalanceRepoParams,
    session: SessionEntity,
  ): Promise<DataState<TrialBalanceReportData>> {
    try {
      const result = await this.service.getTrialBalance(params, session);
      const model = TrialBalanceReportModel.fromJson(result.data);
      return new DataSuccess(model.toEntity());
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }

  public async getGeneralLedger(
    params: GetGeneralLedgerRepoParams,
    session: SessionEntity,
  ): Promise<DataState<GeneralLedgerReportData>> {
    try {
      const result = await this.service.getGeneralLedger(params, session);
      const model = GeneralLedgerReportModel.fromJson(result.data);
      return new DataSuccess({ data: model.toEntity(), meta: result.meta });
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }

  public async getNotes(params: GetNotesRepoParams, session: SessionEntity): Promise<DataState<NotesReportData>> {
    try {
      const result = await this.service.getNotes(params, session);
      const model = NotesModel.fromJson(result.data);
      return new DataSuccess(model.toEntity());
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }

  public async listTrialBalanceLines(
    params: ListTrialBalanceLinesRepoParams,
    session: SessionEntity,
  ): Promise<DataState<TrialBalanceLinesData>> {
    try {
      const result = await this.service.listTrialBalanceLines(params, session);
      const lines = result.data.map(TrialBalanceLineModel.fromJson).map((m) => m.toEntity());
      const counterparts = result.counterparts.map(TrialBalanceLineModel.fromJson).map((m) => m.toEntity());
      return new DataSuccess({ lines, counterparts, meta: result.meta });
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }

  public async listCostValuationGaps(
    params: ListCostValuationGapsRepoParams,
    session: SessionEntity,
  ): Promise<DataState<CostValuationGapsData>> {
    try {
      const result = await this.service.listCostValuationGaps(params, session);
      const rows = result.data.map((m) => m.toEntity());
      return new DataSuccess({ rows, meta: result.meta });
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }
}
