"use client";

import { useMemo } from "react";
import { SearchCombobox, SearchComboboxOption } from "@/core/presentations/components/search-combobox";
import { RawMaterialUnit, RawMaterialUnitLabel } from "@/features/raw-material/domain/enums/raw-material-unit";

const UNIT_OPTIONS: SearchComboboxOption[] = Object.values(RawMaterialUnit).map((value) => ({
  id: value,
  label: RawMaterialUnitLabel[value],
}));

type RawMaterialUnitComboboxProps = {
  value: string;
  onChange: (value: string) => void;
};

export function RawMaterialUnitCombobox(props: RawMaterialUnitComboboxProps) {
  const selected = useMemo(() => UNIT_OPTIONS.find((opt) => opt.id === props.value) ?? null, [props.value]);

  return (
    <SearchCombobox
      label="Satuan"
      options={UNIT_OPTIONS}
      value={selected}
      onChange={(opt) => props.onChange(opt?.id ?? "")}
      placeholder="Pilih satuan"
      emptyMessage="Satuan tidak ditemukan"
      required
    />
  );
}
