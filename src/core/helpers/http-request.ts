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
  contentType?: string;
  inferContentType?: boolean;
  headers?: Record<string, string>;
}

export class HttpRequest {
  public async request(
    params: FetchParams,
    config: FetchConfig = {
      requireAuth: true,
      contentType: "application/json",
      headers: {},
    },
  ): Promise<Record<string, any>> {
    const mergedConfig = {
      requireAuth: config.requireAuth ?? true,
      contentType: config.contentType ?? "application/json",
      headers: Object.assign({}, config.headers),
    };

    if (mergedConfig.requireAuth) {
      if (!params.session) throw new ServerError(ErrorCodes.NO_VALID_SESSION);
      if (!params.session.accessToken) throw new ServerError(ErrorCodes.NO_VALID_SESSION);
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_API_URL;
    if (!baseUrl) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

    const url = new URL(`${baseUrl}${params.path}`);
    if (params.searchParams) {
      Object.entries(params.searchParams).forEach(([key, value]) => url.searchParams.set(key, value));
    }

    const headers: Record<string, string> = {};
    if (mergedConfig.requireAuth && params.session) headers["Authorization"] = `Bearer ${params.session.accessToken}`;

    // Skip Content-Type for FormData so the browser sets the multipart boundary itself.
    const isFormDataBody = params.body instanceof FormData;
    if (mergedConfig.contentType && !isFormDataBody) headers["Content-Type"] = mergedConfig.contentType;

    const generateBody = (body?: Record<string, any> | FormData) => {
      if (!body) return undefined;
      if (body instanceof FormData) return body;
      return JSON.stringify(body);
    };

    const response = await fetch(url, {
      method: params.method,
      headers: Object.assign({}, headers, mergedConfig.headers ?? {}),
      body: generateBody(params.body),
    });

    if (!response.ok) {
      const data = await response.json();
      if (!data) throw new ServerError(ErrorCodes.UNKNOWN, { code: response.status });

      // Some endpoints return a FLAT error body: the discriminating fields sit alongside
      // `code`/`message` with no `details` envelope at all (e.g. PRICE_TIER_SCHEDULE_INVALID
      // carries `reason` + `min_qty`, UNIT_PRICE_MISMATCH carries `line_index`). Forward every
      // remaining top-level key so those callers can read them, while still nesting `details`
      // exactly where existing callers expect it (e.g. `serverError.details.details.lines`).
      const flatFields: Record<string, any> = {};
      if (typeof data === "object" && !Array.isArray(data)) {
        for (const [key, value] of Object.entries(data)) {
          if (key === "code" || key === "message" || key === "details") continue;
          flatFields[key] = value;
        }
      }

      // The transport status, so callers can tell "the server responded and rejected" from
      // "we never heard back". That distinction is load-bearing for idempotent retries: a
      // 4xx means the key is bound to a cached failure and a retry needs a fresh one, while
      // a network failure may still have been processed — rotating there would double-charge.
      const ErrorCode = ErrorCodes.find(data.code);
      if (ErrorCode) {
        throw new ServerError(ErrorCode, {
          ...flatFields,
          ...(data.message ? { message: data.message } : {}),
          details: data.details,
          status: response.status,
        });
      }

      throw new ServerError(ErrorCodes.UNKNOWN, {
        ...flatFields,
        code: data.code,
        message: data.message,
        details: data.details,
        status: response.status,
      });
    }

    const text = await response.text();
    if (!text) return {};
    else return JSON.parse(text);
  }
}
