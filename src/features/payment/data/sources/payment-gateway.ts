import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { PaymentGatewayModel } from "../models/payment-gateway";

export abstract class PaymentGatewayService {
  /**
   * Lists all available payment gateways
   * @param session Current user session
   * @returns Promise resolving to array of PaymentGatewayModel
   */
  public abstract listPaymentGateways(session: SessionEntity): Promise<PaymentGatewayModel[]>;
}

export class PaymentGatewayServiceImpl implements PaymentGatewayService {
  public async listPaymentGateways(session: SessionEntity): Promise<PaymentGatewayModel[]> {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_API_URL;
      if (!baseUrl) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

      const url = `${baseUrl}/payment-gateways`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${session.accessToken}`
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
      if (!data || !Array.isArray(data)) {
        throw new ServerError(ErrorCodes.INVALID_INSTANCE);
      }

      return data.map(item => PaymentGatewayModel.fromJson(item));
    } catch (err) {
      if (err instanceof ServerError) throw err;
      else throw new ServerError(ErrorCodes.UNKNOWN, { error: err });
    }
  }
}