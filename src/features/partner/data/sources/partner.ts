import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { PartnerModel } from "../models/partner";
import { SessionEntity } from "@/features/authentication/domain/entities/session";

export abstract class PartnerService {
  public abstract create(name: string, email: string, phone: string, session: SessionEntity): Promise<boolean>;

  public abstract list(session: SessionEntity): Promise<PartnerModel[]>;
}

export class PartnerServiceImpl implements PartnerService {
  public async create(name: string, email: string, phone: string, session: SessionEntity): Promise<boolean> {
    try {
      if (!session.selectedAccount) throw new ServerError(ErrorCodes.NO_SELECTED_ACCOUNT);

      const baseUrl = process.env.NEXT_PUBLIC_BASE_API_URL;
      if (!baseUrl) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

      const url = `${baseUrl}/partners`;
      const headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${session.accessToken}`,
        "X-Account-Id": session.selectedAccount.id
      };

      const body = {
        name,
        email,
        phone: phone
      };

      const response = await fetch(url, { method: "POST", headers: headers, body: JSON.stringify(body) });
      if (!response.ok) {
        const data = await response.json();
        if (!data) throw new ServerError(ErrorCodes.UNKNOWN, { code: response.status });

        const ErrorCode = ErrorCodes.find(data.code);
        if (ErrorCode) throw new ServerError(ErrorCode);

        throw new ServerError(ErrorCodes.UNKNOWN, { code: data.code, message: data.message });
      }

      return true; // Since the API will not return anything, just 201, we will return true;
    } catch (err) {
      console.log(err);
      if (err instanceof ServerError) throw err;
      else throw new ServerError(ErrorCodes.UNKNOWN, { error: err });
    }
  }

  public async list(session: SessionEntity): Promise<PartnerModel[]> {
    try {
      if (!session.selectedAccount) throw new ServerError(ErrorCodes.NO_SELECTED_ACCOUNT);

      const baseUrl = process.env.NEXT_PUBLIC_BASE_API_URL;
      if (!baseUrl) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

      const url = `${baseUrl}/partners`;
      const headers = {
        Authorization: `Bearer ${session.accessToken}`,
        "X-Account-Id": session.selectedAccount.id
      };

      const response = await fetch(url, { method: "GET", headers });
      if (!response.ok) {
        const data = await response.json();
        if (!data) throw new ServerError(ErrorCodes.UNKNOWN, { code: response.status });

        const ErrorCode = ErrorCodes.find(data.code);
        if (ErrorCode) throw new ServerError(ErrorCode);

        throw new ServerError(ErrorCodes.UNKNOWN, { code: data.code, message: data.message });
      }

      const data = await response.json();
      if (!data || !Array.isArray(data)) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

      return data.map(item => PartnerModel.fromJson(item));
    } catch (err) {
      if (err instanceof ServerError) throw err;
      else throw new ServerError(ErrorCodes.UNKNOWN, { error: err });
    }
  }
}