import { AbstractModel } from "@/core/resources/model";
import { BlockingPostingModel } from "@/features/accounting/data/models/blocking-posting";
import { RetryFailedPostingsResult } from "@/features/accounting/domain/entities/retry-failed-postings-result";

export class RetryFailedPostingsResultModel implements AbstractModel {
  constructor(
    public readonly periodId: string,
    public readonly attempted: number,
    public readonly cleared: number,
    public readonly pendingAfterRetry: number,
    public readonly stillFailing: BlockingPostingModel[],
  ) {}

  public static fromJson(data: Record<string, any>): RetryFailedPostingsResultModel {
    return new RetryFailedPostingsResultModel(
      data["period_id"] ?? "",
      typeof data["attempted"] === "number" ? data["attempted"] : 0,
      typeof data["cleared"] === "number" ? data["cleared"] : 0,
      typeof data["pending_after_retry"] === "number" ? data["pending_after_retry"] : 0,
      Array.isArray(data["still_failing"]) ? data["still_failing"].map(BlockingPostingModel.fromJson) : [],
    );
  }

  public toEntity(): RetryFailedPostingsResult {
    return {
      periodId: this.periodId,
      attempted: this.attempted,
      cleared: this.cleared,
      pendingAfterRetry: this.pendingAfterRetry,
      stillFailing: this.stillFailing.map((p) => p.toValue()),
    };
  }
}
