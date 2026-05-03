import { HttpRequest } from "@/core/helpers/http-request";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { PosSaleModel } from "@/features/pos/data/models/pos-sale";
import { PosSaleService } from "@/features/pos/domain/sources/pos-sale";
import { CreatePosSaleParams, GetPosSaleParams } from "@/features/pos/domain/repositories/pos-sale";

export class PosSaleServiceImpl implements PosSaleService {
  constructor(private readonly http: HttpRequest) {}

  public async create(params: CreatePosSaleParams, session: SessionEntity): Promise<PosSaleModel> {
    try {
      const body: Record<string, any> = {
        date: params.date,
        payment_gateway: { id: params.paymentGatewayId },
        discount: params.discount,
        items: params.items.map((item) => ({
          variant: { id: item.variantId },
          quantity: item.quantity,
          unit_price: item.unitPrice,
          discount: item.discount,
        })),
      };
      if (params.note) body["note"] = params.note;

      const result = await this.http.request(
        {
          path: "/pos/sales",
          method: "POST",
          body,
          session,
        },
        { headers: { "Idempotency-Key": params.idempotencyKey } },
      );

      return PosSaleModel.fromJson(result);
    } catch (err) {
      if (err instanceof ServerError) throw err;
      throw new ServerError(ErrorCodes.UNKNOWN, { error: err });
    }
  }

  public async get(params: GetPosSaleParams, session: SessionEntity): Promise<PosSaleModel> {
    try {
      const result = await this.http.request({
        path: `/pos/sales/${params.id}`,
        method: "GET",
        session,
      });

      return PosSaleModel.fromJson(result);
    } catch (err) {
      if (err instanceof ServerError) throw err;
      throw new ServerError(ErrorCodes.UNKNOWN, { error: err });
    }
  }
}
