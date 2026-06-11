import { Tab, TabGroup, TabList } from "@headlessui/react";
import clsx from "clsx";

interface InvoiceTabFilterProps {
  selectedIndex: number;
  onChange: (index: number) => void;
  tabs?: readonly string[];
}

const DEFAULT_TABS = ["Semua", "Belum Lunas", "Menunggu Settlement", "Lunas"];

export function InvoiceTabFilter({ selectedIndex, onChange, tabs = DEFAULT_TABS }: InvoiceTabFilterProps) {
  return (
    <TabGroup selectedIndex={selectedIndex} onChange={onChange}>
      <TabList className="flex flex-row rounded-lg bg-neutral-100 p-1">
        {tabs.map((label) => (
          <Tab
            key={label}
            className={({ selected }) =>
              clsx(
                "rounded-md px-4 py-1.5 text-sm leading-5 outline-none",
                selected ? "bg-white text-neutral-500 shadow-sm" : "text-neutral-300 hover:text-neutral-400",
              )
            }
          >
            {label}
          </Tab>
        ))}
      </TabList>
    </TabGroup>
  );
}
