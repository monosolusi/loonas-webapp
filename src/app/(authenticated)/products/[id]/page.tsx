"use client";

import { use } from "react";
import { ProductDetailImpl } from "@/app/(authenticated)/products/[id]/_components/product-detail-impl";

type ProductDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default function ProductDetailPage(props: ProductDetailPageProps) {
  const { id } = use(props.params);
  return <ProductDetailImpl id={id} />;
}
