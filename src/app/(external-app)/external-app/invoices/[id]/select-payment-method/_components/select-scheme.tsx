"use client";

import clsx from "clsx";

interface SelectSchemeProps {
  title: string;
  data: {
    id: string;
    imageUrl: string;
    name: string;
  }[];
  value?: string;
  onChange?: (id: string) => void;
}

export function SelectScheme(props: SelectSchemeProps) {
  return (
    <div className="mt-6 border-t pt-6">
      <h3 className="mb-4 text-sm font-medium text-gray-900">{props.title}</h3>
      <div className="grid grid-cols-3 gap-4">
        {props.data.map((item) => (
          <div
            key={item.id}
            className={clsx(
              "flex cursor-pointer flex-col items-center rounded-md border border-gray-200 p-3",
              props.value === item.id && "border-primary-default bg-primary-50",
            )}
            onClick={() => props.onChange?.(item.id)}
          >
            <img src={item.imageUrl} className="h-8 w-auto object-contain" />
            <span className="mt-2 text-xs text-gray-700">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
