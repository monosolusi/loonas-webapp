"use client";

import Image from "next/image";
import { XMarkIcon } from "@heroicons/react/16/solid";
import { TableToolbar } from "@/core/presentations/components/table/table-toolbar";
import { TextInput } from "@/core/presentations/components/text-inputs/text-input";
import { DatePickerInput } from "@/core/presentations/components/text-inputs/date-picker-input";
import { useProductionList } from "@/app/(authenticated)/productions/_providers/production-list-provider";

export function ProductionListToolbar() {
  const { search, dateFrom, dateTo, setSearch, setDateFrom, setDateTo, setPage } = useProductionList();

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleDateFromChange = (value: typeof dateFrom) => {
    setDateFrom(value);
    setPage(1);
  };

  const handleDateToChange = (value: typeof dateTo) => {
    setDateTo(value);
    setPage(1);
  };

  return (
    <TableToolbar>
      <div className="flex flex-row items-center gap-x-3">
        <DatePickerInput label="" value={dateFrom} onChange={handleDateFromChange} placeholder="Dari tanggal" />
        <DatePickerInput label="" value={dateTo} onChange={handleDateToChange} placeholder="Sampai tanggal" />
      </div>
      <div className="w-[250px]">
        <TextInput
          label=""
          placeholder="Cari produk atau catatan..."
          value={search}
          onChange={handleSearchChange}
          leftIcon={
            <Image src="/assets/images/search-icon-neutral-400-w20-h20.svg" alt="" width={20} height={20} />
          }
          rightIcon={
            search ? (
              <button
                type="button"
                onClick={() => handleSearchChange("")}
                className="flex items-center justify-center text-neutral-200 hover:text-neutral-400"
              >
                <XMarkIcon className="size-4" />
              </button>
            ) : undefined
          }
        />
      </div>
    </TableToolbar>
  );
}
