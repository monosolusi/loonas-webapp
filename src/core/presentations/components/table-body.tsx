import React from "react";

export interface TableBodyItem {
  row: {
    node: React.ReactNode;
    hideOnMobile: boolean;
  }[];
}

export function TableBody(props: { items: TableBodyItem[] }) {
  const addHideOnMobileClass = (hideOnMobile: boolean = false, originalClassName: string) => {
    if (hideOnMobile) return `hidden ${originalClassName} sm:table-cell`;
    else return originalClassName;
  };

  if (props.items.length === 0) return null;
  return (
    <tbody className="divide-y divide-gray-200 bg-white">
    {props.items.map((data, index) => (
      <tr key={`table-body-item-${index}`}>
        <td
          className={addHideOnMobileClass(
            data.row.at(0)?.hideOnMobile,
            "py-4 pl-4 text-sm text-left whitespace-nowrap text-gray-500"
          )}
        >
          {data.row.at(0)?.node}
        </td>

        {(data.row.length > 2) && data.row.slice(1, -1).map((item, index) => (
          <td
            key={`table-header-item-${index}`}
            scope="col"
            className={addHideOnMobileClass(
              item.hideOnMobile,
              "px-3 py-4 text-sm text-left whitespace-nowrap text-gray-500"
            )}
          >
            {item.node}
          </td>
        ))}

        {data.row.length > 1 && (
          <td
            scope="col"
            className={addHideOnMobileClass(
              data.row.at(-1)?.hideOnMobile,
              "px-3 py-4 text-sm text-left whitespace-nowrap text-gray-500"
            )}
          >
            {data.row.at(-1)?.node}
          </td>
        )}
      </tr>
    ))}
    </tbody>
  );
}
