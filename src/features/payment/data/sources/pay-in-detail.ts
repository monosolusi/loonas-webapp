import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { GetDetailReturnType, PayInDetailService } from "@/features/payment/domain/sources/pay-in-detail";
import { PublicPayInDetailModel } from "../models/public-pay-in-detail";
import { HttpRequest } from "@/core/helpers/http-request";

export class PayInDetailServiceImpl implements PayInDetailService {
  constructor(private readonly http: HttpRequest) {}

  public async getPublic(params: { invoiceId: string }): Promise<PublicPayInDetailModel> {
    try {
      const method = "GET";
      const path = `/invoices/public-outgoing/${params.invoiceId}/pay-in`;
      const config = { requireAuth: false };
      const result = await this.http.request({ path, method }, config);
      if (!result) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

      return PublicPayInDetailModel.fromJson(result);
    } catch (err) {
      if (err instanceof ServerError) throw err;
      else throw new ServerError(ErrorCodes.UNKNOWN, { error: err });
    }
  }

  public async getDetail(_params: { requestId: string }, _session: SessionEntity): Promise<GetDetailReturnType> {
    throw new ServerError(ErrorCodes.NOT_IMPLEMENTED);
  }

  // TODO: the below is weird implementation. Please change this in the future.
  protected async getDetailImpl(params: { requestId: string }, session: SessionEntity): Promise<Record<string, any>> {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_API_URL;
    if (!baseUrl) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

    const url = `${baseUrl}/payment-requests/${params.requestId}/pay-in-details`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
    });

    if (!response.ok) {
      const data = await response.json();
      if (!data) throw new ServerError(ErrorCodes.UNKNOWN, { code: response.status });

      const ErrorCode = ErrorCodes.find(data.code);
      if (ErrorCode) throw new ServerError(ErrorCode);

      throw new ServerError(ErrorCodes.UNKNOWN, { code: data.code, message: data.message });
    }

    const data = await response.json();
    if (!data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
    return data;
  }
}
