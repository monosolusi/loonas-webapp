type TableHeaderColumn = {
  label: string;
  align?: "left" | "right";
};

type TableHeaderProps = {
  columns: TableHeaderColumn[];
  gridCols: string;
};

export function TableHeader({ columns, gridCols }: TableHeaderProps) {
  return (
    <div className={`grid ${gridCols} border-b border-neutral-100 bg-neutral-50 px-6 py-3`}>
      {columns.map((col) => (
        <span
          key={col.label}
          className={`text-xs leading-4 font-medium tracking-wider text-neutral-300 uppercase ${col.align === "right" ? "text-right" : ""}`}
        >
          {col.label}
        </span>
      ))}
    </div>
  );
}
