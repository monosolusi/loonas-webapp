function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

export function Card({ children, className }: { children?: any, className?: string }) {
  return (
    <div className={
      classNames(
        className,
        "overflow-hidden rounded-lg bg-white shadow-sm"
      )
    }>
      <div className="px-4 py-5 sm:p-6">
        {children}
      </div>
    </div>
  );
}