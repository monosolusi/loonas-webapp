import React from "react";

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

export function Label({
  title,
  description,
  htmlFor,
  bold,
}: {
  title: string;
  description?: string;
  htmlFor?: string;
  bold?: boolean;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className={classNames("text-sm/6 text-gray-900", bold && "font-semibold")}>
        {title}
      </label>
      {description && <p className="mt-1 text-sm/6 text-gray-500">{description}</p>}
    </div>
  );
}
