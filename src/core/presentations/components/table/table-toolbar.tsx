type TableToolbarProps = {
  children: React.ReactNode;
};

export function TableToolbar({ children }: TableToolbarProps) {
  return <div className="flex flex-row items-center justify-between">{children}</div>;
}
