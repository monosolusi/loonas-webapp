import React from "react";

export interface TableBodyItem {
  className?: string;
  row: {
    node: React.ReactNode;
    hideOnMobile: boolean;
    className?: string;
    colSpan?: number
  }[];
}

interface TableBodyProps {
  items: TableBodyItem[];
}

export function TableBody(props: TableBodyProps) {
  const addHideOnMobileClass = (hideOnMobile: boolean = false, originalClassName: string) => {
    if (hideOnMobile) return `hidden ${originalClassName} sm:table-cell`;
    else return originalClassName;
  };

  if (props.items.length === 0) return null;
  return (
    <tbody className="divide-y divide-gray-200 bg-white">
    {props.items.map((data, index) => (
      <tr key={`table-body-item-${index}`} className={data.className}>
        <td
          colSpan={data.row.at(0)?.colSpan}
          className={addHideOnMobileClass(
            data.row.at(0)?.hideOnMobile,
            `py-4 pl-4 text-sm text-left whitespace-nowrap text-gray-500 ${data.row.at(0)?.className}`
          )}
        >
          {data.row.at(0)?.node}
        </td>

        {(data.row.length > 2) && data.row.slice(1, -1).map((item, index) => (
          <td
            key={`table-header-item-${index}`}
            colSpan={item.colSpan}
            scope="col"
            className={addHideOnMobileClass(
              item.hideOnMobile,
              `px-3 py-4 text-sm text-left whitespace-nowrap text-gray-500 ${item.className}`
            )}
          >
            {item.node}
          </td>
        ))}

        {data.row.length > 1 && (
          <td
            scope="col"
            colSpan={data.row.at(-1)?.colSpan}
            className={addHideOnMobileClass(
              data.row.at(-1)?.hideOnMobile,
              `px-3 py-4 text-sm text-left whitespace-nowrap text-gray-500 ${data.row.at(-1)?.className}`
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
