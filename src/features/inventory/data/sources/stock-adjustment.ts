import { HttpRequest } from "@/core/helpers/http-request";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { StockMovementModel } from "@/features/inventory/data/models/stock-movement";
import { StockAdjustmentService, AdjustStockItemServiceParams } from "@/features/inventory/domain/sources/stock-adjustment";

export class StockAdjustmentServiceImpl implements StockAdjustmentService {
  constructor(private readonly http: HttpRequest) {}

  public async adjust(params: AdjustStockItemServiceParams, session: SessionEntity): Promise<StockMovementModel> {
    try {
      // Body is built EXPLICITLY per channel — never `body: params` passthrough.
      // The field name is the sole channel discriminator (no `input_mode`).
      // `expected_book_quantity` is PRESENT on the counted channel and OMITTED
      // on the removed channel.
      const body: Record<string, any> = { reason: params.reason };
      if (params.channel === "counted") {
        body["counted_quantity"] = params.quantity;
        body["expected_book_quantity"] = params.expectedBookQuantity ?? 0;
      } else {
        body["removed_quantity"] = params.quantity;
      }
      if (params.note) {
        body["note"] = params.note;
      }

      const result = await this.http.request(
        {
          path: `/inventory/stock-items/${params.stockItemId}/adjustments`,
          method: "POST",
          body,
          session,
        },
        { headers: { "Idempotency-Key": params.idempotencyKey } },
      );

      return StockMovementModel.fromJson(result);
    } catch (err) {
      if (err instanceof ServerError) throw err;
      else throw new ServerError(ErrorCodes.UNKNOWN, { error: err });
    }
  }
}