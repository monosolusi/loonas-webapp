import React from "react";

export interface TableHeaderItem {
  node: React.ReactNode;
  hideOnMobile: boolean;
  className?: string;
}

export function TableHeader(props: { items: TableHeaderItem[] }) {

  const addHideOnMobileClass = (hideOnMobile: boolean = false, originalClassName: string) => {
    if (hideOnMobile) return `hidden ${originalClassName} sm:table-cell`;
    else return originalClassName;
  };

  if (props.items.length === 0) return null;
  return (
    <thead className="bg-gray-50">
    <tr>
      {props.items.length > 0 && (
        <th
          scope="col"
          className={addHideOnMobileClass(
            props.items.at(0)?.hideOnMobile,
            `py-3.5 pl-4 text-left text-sm font-semibold ${props.items.at(0)?.className}`
          )}
        >
          {props.items.at(0)?.node}
        </th>
      )}


      {(props.items.length > 2) && props.items.slice(1, -1).map((item, index) => (
        <th
          key={`table-header-item-${index}`}
          scope="col"
          className={addHideOnMobileClass(
            item.hideOnMobile,
            `px-3 py-3.5 text-sm text-left font-semibold text-gray-900 ${item.className}`
          )}
        >
          {item.node}
        </th>
      ))}

      {props.items.length > 1 && (
        <th
          scope="col"
          className={addHideOnMobileClass(
            props.items.at(-1)?.hideOnMobile,
            `py-3.5 pr-4 pl-3 text-sm text-left  text-gray-900 ${props.items.at(-1)?.className}`
          )}
        >
          {props.items.at(-1)?.node}
        </th>
      )}
    </tr>
    </thead>
  );
}
