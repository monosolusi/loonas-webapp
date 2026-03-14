import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { PartnerModel } from "../models/partner";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { IncomingInvoiceModel } from "@/features/invoice/data/models/incoming-invoice";
import {
  PartnerService,
  PartnerServiceFilter,
  PartnerServiceSearchParams,
  PartnerServiceUpdateFields,
} from "@/features/partner/domain/sources/partner";
import { HttpRequest } from "@/core/helpers/http-request";

export class PartnerServiceImpl implements PartnerService {
  constructor(private readonly http: HttpRequest) {
    Object.freeze(this);
  }

  public async update(
    filter: Pick<PartnerServiceFilter, "id">,
    updateData: PartnerServiceUpdateFields,
    session: SessionEntity,
  ): Promise<PartnerModel> {
    try {
      if (!session.accessToken) throw new ServerError(ErrorCodes.NO_VALID_SESSION);

      const baseUrl = process.env.NEXT_PUBLIC_BASE_API_URL;
      if (!baseUrl) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

      const url = new URL(`${baseUrl}/partners/${filter.id}`);
      const method = "PUT";
      const headers = {
        Authorization: `Bearer ${session.accessToken}`,
        "Content-Type": "application/json",
      };

      const body = {
        ...(updateData.name && { name: updateData.name }),
        ...(updateData.email && { email: updateData.email }),
        ...(updateData.phone && { phone: updateData.phone }),
      };

      const response = await fetch(url, { method, headers, body: JSON.stringify(body) });
      if (!response.ok) {
        const data = await response.json();
        if (!data) throw new ServerError(ErrorCodes.UNKNOWN, { code: response.status });

        const ErrorCode = ErrorCodes.find(data.code);
        if (ErrorCode) throw new ServerError(ErrorCode);

        throw new ServerError(ErrorCodes.UNKNOWN, { code: data.code, message: data.message });
      }

      const data = await response.json();
      if (!data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
      return PartnerModel.fromJson(data);
    } catch (err) {
      if (err instanceof ServerError) throw err;
      else throw new ServerError(ErrorCodes.UNKNOWN, { error: err });
    }
  }

  public async listInvoice(
    filter: PartnerServiceFilter,
    params: PartnerServiceSearchParams,
    session: SessionEntity,
  ): Promise<IncomingInvoiceModel[]> {
    try {
      const path = `/partners/${filter.partnerId}/invoices`;
      const method = "GET";
      const data = await this.http.request({ path, method, session, searchParams: params });

      if (!data || !Array.isArray(data)) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
      return data.map(IncomingInvoiceModel.fromJson);
    } catch (err) {
      if (err instanceof ServerError) throw err;
      else throw new ServerError(ErrorCodes.UNKNOWN, { error: err });
    }
  }

  public async get(params: PartnerServiceFilter, session: SessionEntity): Promise<PartnerModel> {
    try {
      if (!params.id) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

      const baseUrl = process.env.NEXT_PUBLIC_BASE_API_URL;
      if (!baseUrl) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

      const url = `${baseUrl}/partners/${params.id}`;
      const headers = {
        Authorization: `Bearer ${session.accessToken}`,
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
      if (!data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

      return PartnerModel.fromJson(data);
    } catch (err) {
      if (err instanceof ServerError) throw err;
      else throw new ServerError(ErrorCodes.UNKNOWN, { error: err });
    }
  }

  public async create(name: string, email: string, phone: string, session: SessionEntity): Promise<boolean> {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_API_URL;
      if (!baseUrl) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

      const url = `${baseUrl}/partners`;
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.accessToken}`,
      };

      const body = {
        name,
        email,
        phone: phone,
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
      const baseUrl = process.env.NEXT_PUBLIC_BASE_API_URL;
      if (!baseUrl) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

      const url = `${baseUrl}/partners`;
      const headers = {
        Authorization: `Bearer ${session.accessToken}`,
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

      return data.map((item) => PartnerModel.fromJson(item));
    } catch (err) {
      if (err instanceof ServerError) throw err;
      else throw new ServerError(ErrorCodes.UNKNOWN, { error: err });
    }
  }
}
