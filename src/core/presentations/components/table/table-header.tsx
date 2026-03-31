import clsx from "clsx";

type TableHeaderColumn = {
  label: string;
  align?: "left" | "right";
};

type TableHeaderProps = {
  columns: TableHeaderColumn[];
  className?: string;
};

export function TableHeader({ columns, className }: TableHeaderProps) {
  return (
    <div className={clsx("grid border-b border-neutral-100 bg-neutral-50 px-6 py-3", className)}>
      {columns.map((col) => (
        <span
          key={col.label}
          className={clsx(
            "text-xs leading-4 font-medium tracking-wider text-neutral-300 uppercase",
            col.align === "right" && "text-right",
          )}
        >
          {col.label}
        </span>
      ))}
    </div>
  );
}
