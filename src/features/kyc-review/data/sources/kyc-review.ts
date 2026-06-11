import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { HttpRequest } from "@/core/helpers/http-request";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { KycReviewService } from "@/features/kyc-review/domain/sources/kyc-review";
import { VerificationWorkSummaryModel } from "@/features/kyc-review/data/models/verification-work-summary";
import { VerificationWorkDetailModel } from "@/features/kyc-review/data/models/verification-work-detail";
import { VerificationWorkStatus } from "@/features/kyc-review/domain/enums/verification-work-status";
import { ReviewAction } from "@/features/kyc-review/domain/enums/review-action";

export class KycReviewServiceImpl implements KycReviewService {
  constructor(private readonly http: HttpRequest) {}

  public async listWorks(
    params: { status?: VerificationWorkStatus },
    session: SessionEntity,
  ): Promise<VerificationWorkSummaryModel[]> {
    try {
      const searchParams: Record<string, string> = {};
      if (params.status) searchParams["status"] = params.status;

      const result = await this.http.request({
        path: "/internal/verification-works",
        method: "GET",
        searchParams,
        session,
      });

      const data = result["data"];
      if (!data || !Array.isArray(data)) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
      return data.map(VerificationWorkSummaryModel.fromJson);
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
