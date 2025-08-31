import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";

interface FetchParams {
  path: string;
  method: "POST" | "GET" | "PUT" | "DELETE" | "PATCH";
  body?: Record<string, any> | FormData;
  searchParams?: Record<string, any>;
  session?: SessionEntity;
}

interface FetchConfig {
  requireAuth?: boolean;
  requireAccount?: boolean;
  contentType?: string;
  inferContentType?: boolean;
}

export class HttpRequest {
  public async request(
    params: FetchParams,
    config: FetchConfig = {
      requireAuth: true,
      requireAccount: true,
      contentType: "application/json",
    },
  ) {
    const mergedConfig = {
      requireAuth: config.requireAuth ?? true,
      requireAccount: config.requireAccount ?? true,
      contentType: config.contentType,
    };

    if (mergedConfig.requireAuth || mergedConfig.requireAccount) {
      if (!params.session) throw new ServerError(ErrorCodes.NO_VALID_SESSION);
      if (!params.session.accessToken) throw new ServerError(ErrorCodes.NO_VALID_SESSION);
      if (mergedConfig.requireAccount && !params.session.selectedAccount) {
        throw new ServerError(ErrorCodes.NO_SELECTED_ACCOUNT);
      }
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_API_URL;
    if (!baseUrl) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

    const url = new URL(`${baseUrl}${params.path}`);
    if (params.searchParams) {
      Object.entries(params.searchParams).forEach(([key, value]) => url.searchParams.set(key, value));
    }

    const headers: Record<string, string> = {};
    if (mergedConfig.requireAuth && params.session) headers["Authorization"] = `Bearer ${params.session.accessToken}`;
    if (mergedConfig.contentType) headers["Content-Type"] = mergedConfig.contentType;
    if (mergedConfig.requireAccount && params.session && params.session.selectedAccount) {
      headers["X-Account-Id"] = params.session.selectedAccount.id;
    }

    const generateBody = (body?: Record<string, any> | FormData) => {
      if (!body) return undefined;
      if (body instanceof FormData) return body;
      return JSON.stringify(body);
    };

    const response = await fetch(url, {
      method: params.method,
      headers: headers,
      body: generateBody(params.body),
    });

    if (!response.ok) {
      const data = await response.json();
      if (!data) throw new ServerError(ErrorCodes.UNKNOWN, { code: response.status });

      const ErrorCode = ErrorCodes.find(data.code);
      if (ErrorCode) throw new ServerError(ErrorCode);

      throw new ServerError(ErrorCodes.UNKNOWN, { code: data.code, message: data.message });
    }

    return response.json();
  }
}
