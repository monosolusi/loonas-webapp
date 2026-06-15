import { DataFailed, DataState, DataSuccess } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import {
  ReportRepository,
  GetNeracaRepoParams,
  GetLabaRugiRepoParams,
  GetArusKasRepoParams,
  GetTrialBalanceRepoParams,
  GetGeneralLedgerRepoParams,
  GetCalkRepoParams,
  NeracaReportData,
  LabaRugiReportData,
  ArusKasReportData,
  TrialBalanceReportData,
  GeneralLedgerReportData,
  CalkReportData,
} from "@/features/accounting/domain/repositories/report";
import { ReportService } from "@/features/accounting/domain/sources/report";
import { NeracaModel } from "@/features/accounting/data/models/neraca";

export class ReportRepositoryImpl implements ReportRepository {
  constructor(private readonly service: ReportService) {}

  public async getNeraca(params: GetNeracaRepoParams, session: SessionEntity): Promise<DataState<NeracaReportData>> {
    try {
      const result = await this.service.getNeraca(params, session);
      const model = NeracaModel.fromJson(result.data);
      return new DataSuccess(model.toEntity());
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }

  public async getLabaRugi(
    params: GetLabaRugiRepoParams,
    session: SessionEntity,
  ): Promise<DataState<LabaRugiReportData>> {
    try {
      const result = await this.service.getLabaRugi(params, session);
      return new DataSuccess({ data: result.data });
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }

  public async getArusKas(params: GetArusKasRepoParams, session: SessionEntity): Promise<DataState<ArusKasReportData>> {
    try {
      const result = await this.service.getArusKas(params, session);
      return new DataSuccess({ data: result.data });
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
      return new DataSuccess({ data: result.data });
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
      return new DataSuccess({ data: result.data, meta: result.meta });
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }

  public async getCalk(params: GetCalkRepoParams, session: SessionEntity): Promise<DataState<CalkReportData>> {
    try {
      const result = await this.service.getCalk(params, session);
      return new DataSuccess({ data: result.data });
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }
}
