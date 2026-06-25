import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import {
  ProfitabilityService,
  GetVariantHppServiceParams,
  GetVariantHppServiceResult,
  GetVariantProductionCostServiceParams,
  GetVariantProductionCostServiceResult,
  GetVariantGrossProfitServiceParams,
  GetVariantGrossProfitServiceResult,
  GetVariantRecommendedPriceServiceParams,
  GetVariantRecommendedPriceServiceResult,
} from "@/features/profitability/domain/sources/profitability";
import { VariantHppModel } from "@/features/profitability/data/models/variant-hpp";
import { VariantProductionCostModel } from "@/features/profitability/data/models/variant-production-cost";
import { VariantGrossProfitModel } from "@/features/profitability/data/models/variant-gross-profit";
import { VariantRecommendedPriceModel } from "@/features/profitability/data/models/variant-recommended-price";

const INCOMPLETE_RECIPE_ERROR_CODE: { code: string; httpCode: number; message: string } = {
  code: "INCOMPLETE_RECIPE",
  httpCode: 422,
  message: "Recipe is incomplete",
};

async function profitabilityFetch(
  url: URL,
  session: SessionEntity,
): Promise<Record<string, any>> {
  if (!session.accessToken) throw new ServerError(ErrorCodes.NO_VALID_SESSION);

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
      "Content-Type": "application/json",
    },
  });

  if (response.status === 422) {
    const body = await response.json().catch(() => ({}));
    throw new ServerError(INCOMPLETE_RECIPE_ERROR_CODE, {
      code: body?.code,
      message: body?.message,
      details: body?.details,
    });
  }

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    const found = ErrorCodes.find(body?.code);
    if (found) throw new ServerError(found, { message: body?.message, details: body?.details });
    throw new ServerError(ErrorCodes.UNKNOWN, { code: body?.code, message: body?.message, details: body?.details });
  }

  return response.json();
}

function getBaseUrl(): string {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_API_URL;
  if (!baseUrl) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
  return baseUrl;
}

export class ProfitabilityServiceImpl implements ProfitabilityService {
  public async getVariantHpp(
    params: GetVariantHppServiceParams,
    session: SessionEntity,
  ): Promise<GetVariantHppServiceResult> {
    const url = new URL(
      `${getBaseUrl()}/products/${params.productId}/variants/${params.variantId}/hpp`,
    );
    const data = await profitabilityFetch(url, session);
    return { data: VariantHppModel.fromJson(data) };
  }

  public async getVariantProductionCost(
    params: GetVariantProductionCostServiceParams,
    session: SessionEntity,
  ): Promise<GetVariantProductionCostServiceResult> {
    const url = new URL(
      `${getBaseUrl()}/products/${params.productId}/variants/${params.variantId}/production-cost`,
    );
    url.searchParams.set("quantity", String(params.quantity));
    const data = await profitabilityFetch(url, session);
    return { data: VariantProductionCostModel.fromJson(data) };
  }

  public async getVariantGrossProfit(
    params: GetVariantGrossProfitServiceParams,
    session: SessionEntity,
  ): Promise<GetVariantGrossProfitServiceResult> {
    const url = new URL(
      `${getBaseUrl()}/products/${params.productId}/variants/${params.variantId}/gross-profit`,
    );
    const data = await profitabilityFetch(url, session);
    return { data: VariantGrossProfitModel.fromJson(data) };
  }

  public async getVariantRecommendedPrice(
    params: GetVariantRecommendedPriceServiceParams,
    session: SessionEntity,
  ): Promise<GetVariantRecommendedPriceServiceResult> {
    const url = new URL(
      `${getBaseUrl()}/products/${params.productId}/variants/${params.variantId}/recommended-price`,
    );
    url.searchParams.set("margin", String(params.margin));
    const data = await profitabilityFetch(url, session);
    return { data: VariantRecommendedPriceModel.fromJson(data) };
  }
}
