import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { InvoiceModel } from "@/features/invoice/data/models/invoice";

interface InvoiceServiceFilter {
}

interface InvoiceServiceFilterParams {
  limit?: number;
}

export abstract class InvoiceService {
  public abstract list(filter: InvoiceServiceFilter, params: InvoiceServiceFilterParams, session: SessionEntity): Promise<InvoiceModel[]>;
}

export class InvoiceServiceImpl implements InvoiceService {
  public async list(filter: InvoiceServiceFilter, params: InvoiceServiceFilterParams, session: SessionEntity): Promise<InvoiceModel[]> {
    try {
      if (!session.selectedAccount) throw new ServerError(ErrorCodes.NO_SELECTED_ACCOUNT);

      const baseUrl = process.env.NEXT_PUBLIC_BASE_API_URL;
      if (!baseUrl) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

      const url = new URL(`${baseUrl}/invoices`);
      if (params.limit) url.searchParams.set("limit", params.limit.toString());

      const method = "GET";
      const headers = {
        "Authorization": `Bearer ${session.accessToken}`,
        "X-Account-Id": session.selectedAccount.id
      };

      const response = await fetch(url, { method, headers });
      if (!response.ok) {
        const data = await response.json();
        if (!data) throw new ServerError(ErrorCodes.UNKNOWN, { code: response.status });

        const ErrorCode = ErrorCodes.find(data.code);
        if (ErrorCode) throw new ServerError(ErrorCode);

        throw new ServerError(ErrorCodes.UNKNOWN, { code: data.code, message: data.message });
      }

      const data = await response.json();
      if (!data || !Array.isArray(data)) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
      return data.map(item => InvoiceModel.fromJson(item));
    } catch (err) {
      if (err instanceof ServerError) throw err;
      else throw new ServerError(ErrorCodes.UNKNOWN, { error: err });
    }
  }

}
