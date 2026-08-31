import { HttpRequest } from "@/core/helpers/http-request";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { BalanceMovementModel } from "@/features/balance/data/models/balance-movement";
import {
  BalanceMovementService,
  ListBalanceMovementsServiceParams,
  ListBalanceMovementsServiceResult,
} from "@/features/balance/domain/sources/balance-movement";

export class BalanceMovementServiceImpl implements BalanceMovementService {
  constructor(private readonly http: HttpRequest) {}

  public async list(
    params: ListBalanceMovementsServiceParams,
    session: SessionEntity,
  ): Promise<ListBalanceMovementsServiceResult> {
    try {
      // Exactly `page` + `limit` — the operation declares no `offset` (LNS-753), and the
      // account is resolved from the JWT orgId server-side.
      const searchParams: Record<string, any> = {};
      if (params.page) searchParams["page"] = String(params.page);
      if (params.limit) searchParams["limit"] = String(params.limit);

      const result = await this.http.request({
        path: "/balance/movements",
        method: "GET",
        searchParams,
        session,
      });

      const items = result?.data;
      if (!Array.isArray(items)) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

      return {
        data: items.map(BalanceMovementModel.fromJson),
        meta: {
          page: result.meta?.page ?? 1,
          limit: result.meta?.limit ?? 100,
          total: result.meta?.total ?? 0,
          totalPages: result.meta?.total_pages ?? 1,
        },
      };
    } catch (err) {
      if (err instanceof ServerError) throw err;
      else throw new ServerError(ErrorCodes.UNKNOWN, { error: err });
    }
  }
}
