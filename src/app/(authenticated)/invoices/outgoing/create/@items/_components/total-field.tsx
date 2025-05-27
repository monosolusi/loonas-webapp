import { TextInputWithLeftAddOn } from "@/core/presentations/components/text-input-with-left-add-on";
import React, { useMemo } from "react";

interface TotalFieldProps {
  qty: number;
  price: number;
}

export function TotalField(props: TotalFieldProps) {
  const total = useMemo(() => {
    if (props.qty === 0) return 0;
    if (props.price === 0) return 0;
    return props.qty * props.price;
  }, [props.qty, props.price]);

  return (
    <TextInputWithLeftAddOn
      title="Jumlah"
      leftAddOn="Rp"
      textDirection="text-right"
      value={total.toLocaleString("id-ID")}
      disabled
    />
  );
}
