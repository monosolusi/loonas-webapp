type TableToolbarProps = {
  children: React.ReactNode;
};

export function TableToolbar({ children }: TableToolbarProps) {
  return <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">{children}</div>;
}
