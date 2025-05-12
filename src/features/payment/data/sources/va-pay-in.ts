import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { PayInService } from "@/features/payment/data/sources/pay-in";
import { VirtualAccountPayInDetailModel } from "../models/va-pay-in-detail";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";

export class VirtualAccountPayInService implements PayInService {
  public async getDetail(params: {
    requestId: string;
  }, session: SessionEntity): Promise<VirtualAccountPayInDetailModel> {
    try {
      if (!session.selectedAccount) throw new ServerError(ErrorCodes.NO_SELECTED_ACCOUNT);

      const baseUrl = process.env.NEXT_PUBLIC_BASE_API_URL;
      if (!baseUrl) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

      const url = `${baseUrl}/payment-requests/${params.requestId}/pay-in-details`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${session.accessToken}`,
          "X-Account-Id": session.selectedAccount.id
        }
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

      return VirtualAccountPayInDetailModel.fromJson(data);
    } catch (err) {
      if (err instanceof ServerError) throw err;
      throw new ServerError(ErrorCodes.UNKNOWN, { error: err });
    }
  }

}