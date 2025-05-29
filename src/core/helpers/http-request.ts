import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";

interface FetchParams {
  path: string;
  method: "POST" | "GET" | "PUT" | "DELETE" | "PATH";
  body?: Record<string, any>;
  searchParams?: Record<string, any>;
  session: SessionEntity;
}

interface FetchConfig {
  requireAuth?: boolean;
  requireAccount?: boolean;
  contentType?: string;
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
    if (config.requireAccount && !params.session.selectedAccount) throw new ServerError(ErrorCodes.NO_SELECTED_ACCOUNT);
    if (config.requireAuth && !params.session.accessToken) throw new ServerError(ErrorCodes.NO_VALID_SESSION);

    const baseUrl = process.env.NEXT_PUBLIC_BASE_API_URL;
    if (!baseUrl) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

    const url = new URL(`${baseUrl}${params.path}`);
    if (params.searchParams) {
      Object.entries(params.searchParams).forEach(([key, value]) => url.searchParams.set(key, value));
    }

    const headers = {
      ...(config.requireAuth && { Authorization: `Bearer ${params.session.accessToken}` }),
      ...(config.requireAccount && { "X-Account-Id": params.session.selectedAccount?.id }),
      ...(config.contentType && { "Content-Type": config.contentType }),
    };

    const response = await fetch(url, {
      method: params.method,
      headers,
      body: params.body ? JSON.stringify(params.body) : undefined,
    });

    if (!response.ok) {
      const data = await response.json();
      if (!data) throw new ServerError(ErrorCodes.UNKNOWN, { code: response.status });

      const ErrorCode = ErrorCodes.find(data.code);
      if (ErrorCode) throw new ServerError(ErrorCode);

      throw new ServerError(ErrorCodes.UNKNOWN, { code: data.code, message: data.message });
    }

    const data = await response.json();
    return data;
  }
}
