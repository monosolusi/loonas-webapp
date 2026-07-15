import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { HttpRequest } from "@/core/helpers/http-request";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { PaginationMetaModel } from "@/core/resources/pagination-meta-model";
import { DEFAULT_PAGE_SIZE } from "@/core/utilities/pagination";
import { KycReviewService } from "@/features/kyc-review/domain/sources/kyc-review";
import { VerificationWorkSummaryModel } from "@/features/kyc-review/data/models/verification-work-summary";
import { VerificationWorkDetailModel } from "@/features/kyc-review/data/models/verification-work-detail";
import { VerificationWorkStatus } from "@/features/kyc-review/domain/enums/verification-work-status";
import { ReviewAction } from "@/features/kyc-review/domain/enums/review-action";

export class KycReviewServiceImpl implements KycReviewService {
  constructor(private readonly http: HttpRequest) {}

  public async listWorks(
    params: { status?: VerificationWorkStatus; page?: number; limit?: number },
    session: SessionEntity,
  ): Promise<{ data: VerificationWorkSummaryModel[]; meta: PaginationMetaModel }> {
    try {
      const searchParams: Record<string, string> = {};
      if (params.status) searchParams["status"] = params.status;
      if (params.page) searchParams["page"] = String(params.page);
      if (params.limit) searchParams["limit"] = String(params.limit);

      const result = await this.http.request({
        path: "/internal/verification-works",
        method: "GET",
        searchParams,
        session,
      });

      const raw = result["data"];
      if (!raw || !Array.isArray(raw)) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
      const data = raw.map(VerificationWorkSummaryModel.fromJson);

      const meta = new PaginationMetaModel({
        page: result.meta?.page ?? params.page ?? 1,
        limit: result.meta?.limit ?? params.limit ?? DEFAULT_PAGE_SIZE,
        total: result.meta?.total ?? data.length,
        totalPages: result.meta?.total_pages ?? 1,
      });

      return { data, meta };
    } catch (err) {
      if (err instanceof ServerError) throw err;
      else throw new ServerError(ErrorCodes.UNKNOWN, { error: err });
    }
  }

  public async getWork(id: string, session: SessionEntity): Promise<VerificationWorkDetailModel> {
    try {
      const result = await this.http.request({
        path: `/internal/verification-works/${id}`,
        method: "GET",
        session,
      });

      const data = result["data"];
      if (!data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
      return VerificationWorkDetailModel.fromJson(data);
    } catch (err) {
      if (err instanceof ServerError) throw err;
      else throw new ServerError(ErrorCodes.UNKNOWN, { error: err });
    }
  }

  public async claimWork(id: string, session: SessionEntity): Promise<{ id: string }> {
    try {
      const result = await this.http.request({
        path: `/internal/verification-works/${id}/claim`,
        method: "POST",
        session,
      });

      const workId = result["id"] ?? result["data"]?.["id"];
      if (!workId) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
      return { id: workId };
    } catch (err) {
      if (err instanceof ServerError) throw err;
      else throw new ServerError(ErrorCodes.UNKNOWN, { error: err });
    }
  }

  public async reviewWork(
    id: string,
    action: ReviewAction,
    notes: string | undefined,
    session: SessionEntity,
  ): Promise<void> {
    try {
      const body: Record<string, any> = { action };
      if (notes) body["notes"] = notes;

      await this.http.request({
        path: `/internal/verification-works/${id}/review`,
        method: "POST",
        body,
        session,
      });
    } catch (err) {
      if (err instanceof ServerError) throw err;
      else throw new ServerError(ErrorCodes.UNKNOWN, { error: err });
    }
  }
}
