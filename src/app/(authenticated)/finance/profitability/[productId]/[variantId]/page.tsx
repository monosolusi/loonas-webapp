import { use } from "react";
import { ProfitabilityDetailProvider } from "@/app/(authenticated)/finance/profitability/[productId]/[variantId]/_providers/profitability-detail-provider";
import { ProfitabilityDetailSkeleton } from "@/app/(authenticated)/finance/profitability/[productId]/[variantId]/_components/profitability-detail-skeleton";
import { ProfitabilityDetailHeader } from "@/app/(authenticated)/finance/profitability/[productId]/[variantId]/_components/profitability-detail-header";
import { CogsBlock } from "@/app/(authenticated)/finance/profitability/[productId]/[variantId]/_components/cogs-block";
import { CostStructureBlock } from "@/app/(authenticated)/finance/profitability/[productId]/[variantId]/_components/cost-structure-block";
import { GrossProfitBlock } from "@/app/(authenticated)/finance/profitability/[productId]/[variantId]/_components/gross-profit-block";
import { RecommendedPriceBlock } from "@/app/(authenticated)/finance/profitability/[productId]/[variantId]/_components/recommended-price-block";

type ProfitabilityDetailPageProps = {
  params: Promise<{ productId: string; variantId: string }>;
};

export default function ProfitabilityDetailPage(props: ProfitabilityDetailPageProps) {
  const { productId, variantId } = use(props.params);

  return (
    <ProfitabilityDetailProvider
      productId={productId}
      variantId={variantId}
      loading={<ProfitabilityDetailSkeleton />}
    >
      <div className="flex flex-col gap-y-6">
        <ProfitabilityDetailHeader />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <CogsBlock />
          <GrossProfitBlock />
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <CostStructureBlock />
          <RecommendedPriceBlock />
        </div>
      </div>
    </ProfitabilityDetailProvider>
  );
}
