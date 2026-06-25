import { use } from "react";
import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/20/solid";
import { ProfitabilityDetailProvider } from "@/app/(authenticated)/finance/profitability/[productId]/[variantId]/_providers/profitability-detail-provider";
import { HppBlock } from "@/app/(authenticated)/finance/profitability/[productId]/[variantId]/_components/hpp-block";
import { CostStructureBlock } from "@/app/(authenticated)/finance/profitability/[productId]/[variantId]/_components/cost-structure-block";
import { GrossProfitBlock } from "@/app/(authenticated)/finance/profitability/[productId]/[variantId]/_components/gross-profit-block";
import { RecommendedPriceBlock } from "@/app/(authenticated)/finance/profitability/[productId]/[variantId]/_components/recommended-price-block";

type ProfitabilityDetailPageProps = {
  params: Promise<{ productId: string; variantId: string }>;
};

export default function ProfitabilityDetailPage(props: ProfitabilityDetailPageProps) {
  const { productId, variantId } = use(props.params);

  return (
    <ProfitabilityDetailProvider productId={productId} variantId={variantId}>
      <div className="flex flex-col gap-y-6 p-6">
        <div className="flex flex-row items-center gap-x-2">
          <Link
            href="/finance/profitability"
            className="flex items-center gap-x-1.5 text-sm text-neutral-300 hover:text-neutral-500"
          >
            <ArrowLeftIcon className="size-4" />
            Kembali ke Profitabilitas
          </Link>
        </div>

        <HppBlock />
        <CostStructureBlock />
        <GrossProfitBlock />
        <RecommendedPriceBlock />
      </div>
    </ProfitabilityDetailProvider>
  );
}
