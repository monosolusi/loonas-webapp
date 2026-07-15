import { Tab, TabGroup, TabList } from "@headlessui/react";
import clsx from "clsx";

interface TabFilterProps {
  selectedIndex: number;
  onChange: (index: number) => void;
  tabs: readonly string[];
}

export function TabFilter({ selectedIndex, onChange, tabs }: TabFilterProps) {
  return (
    <TabGroup selectedIndex={selectedIndex} onChange={onChange}>
      <TabList className="flex w-fit flex-row rounded-lg bg-neutral-100 p-1">
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
