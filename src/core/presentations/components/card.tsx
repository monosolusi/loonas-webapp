function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

interface CardProps {
  children?: React.ReactNode;
  className?: string;
}

export function Card(props: CardProps) {
  return (
    <div className={classNames("rounded-lg bg-white shadow-sm", props.className, "overflow-hidden")}>
      <div className="px-4 py-5 sm:p-6">{props.children}</div>
    </div>
  );
}
