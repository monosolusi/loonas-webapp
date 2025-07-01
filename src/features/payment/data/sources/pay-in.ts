import { VirtualAccountPayInDetailModel } from "@/features/payment/data/models/va-pay-in-detail";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { CreditCardFullRedirectPayInDetailModel } from "@/features/payment/data/models/cc-full-redirect-pay-in-detail";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";

type GetDetailReturnType = VirtualAccountPayInDetailModel | CreditCardFullRedirectPayInDetailModel;

export abstract class PayInService {
  public abstract getDetail(params: { requestId: string }, session: SessionEntity): Promise<GetDetailReturnType>;
}

export class PayInServiceImpl implements PayInService {
  public async getDetail(params: { requestId: string }, session: SessionEntity): Promise<GetDetailReturnType> {
    throw new ServerError(ErrorCodes.NOT_IMPLEMENTED);
  }

  protected async getDetailImpl(params: { requestId: string }, session: SessionEntity): Promise<Record<string, any>> {
    if (!session.selectedAccount) throw new ServerError(ErrorCodes.NO_SELECTED_ACCOUNT);

    const baseUrl = process.env.NEXT_PUBLIC_BASE_API_URL;
    if (!baseUrl) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

    const url = `${baseUrl}/payment-requests/${params.requestId}/pay-in-details`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
        "X-Account-Id": session.selectedAccount.id,
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
