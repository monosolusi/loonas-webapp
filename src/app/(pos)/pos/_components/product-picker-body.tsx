"use client";

import { ServerError } from "@/core/resources/server-error";
import {
  PickerRow,
  ProductPickerBodyList,
} from "@/app/(pos)/pos/_components/product-picker-body-list";
import { ProductPickerGrid } from "@/app/(pos)/pos/_components/product-picker-grid";
import { ProductPickerBodyError } from "@/app/(pos)/pos/_components/product-picker-body-error";
import { ProductPickerBodyLoading } from "@/app/(pos)/pos/_components/product-picker-body-loading";
import { ProductPickerBodyEmpty } from "@/app/(pos)/pos/_components/product-picker-body-empty";

type ProductPickerBodyProps = {
  error: ServerError | null;
  loading: boolean;
  isDrilldown: boolean;
  rows: PickerRow[];
  highlight: number;
  onActivate: (idx: number) => void;
};

export function ProductPickerBody({ error, loading, isDrilldown, rows, highlight, onActivate }: ProductPickerBodyProps) {
  if (error) return <ProductPickerBodyError error={error} />;
  if (loading && rows.length === 0) return <ProductPickerBodyLoading />;
  if (rows.length === 0) return <ProductPickerBodyEmpty isDrilldown={isDrilldown} />;
  return (
    <>
      {/* Desktop: keyboard-navigable list. Mobile: tappable product grid. */}
      <div className="hidden lg:block">
        <ProductPickerBodyList rows={rows} highlight={highlight} onActivate={onActivate} />
      </div>
      <div className="lg:hidden">
        <ProductPickerGrid rows={rows} onActivate={onActivate} />
      </div>
    </>
  );
}
