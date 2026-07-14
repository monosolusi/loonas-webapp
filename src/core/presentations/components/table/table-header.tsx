import clsx from "clsx";

type TableHeaderColumn = {
  label: string;
  align?: "left" | "right" | "center";
};

type TableHeaderProps = {
  columns: TableHeaderColumn[];
  className?: string;
  /**
   * Hide the column-label row below `lg`. Use for browse lists that reflow into
   * stacked `MobileListCard`s (cards don't need column headers). Leave off for
   * dense scroll-strategy tables that keep the full grid on mobile.
   */
  hideOnMobile?: boolean;
};

export function TableHeader({ columns, className, hideOnMobile }: TableHeaderProps) {
  return (
    <div
      className={clsx(
        "border-b border-neutral-100 bg-neutral-50 px-6 py-3",
        hideOnMobile ? "hidden lg:grid" : "grid",
        className,
      )}
    >
      {columns.map((col) => (
        <span
          key={col.label}
          className={clsx(
            "text-xs leading-4 font-medium tracking-wider text-neutral-300 uppercase",
            col.align === "right" && "text-right",
            col.align === "center" && "text-center",
          )}
        >
          {col.label}
        </span>
      ))}
    </div>
  );
}
