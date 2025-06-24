import clsx from "clsx";

interface CardProps {
  children?: React.ReactNode;
  className?: string;
}

export function Card(props: CardProps) {
  return (
    <div className={clsx("rounded-md bg-white shadow-sm", props.className, "overflow-hidden")}>
      <div className="px-4 py-5 sm:p-6">{props.children}</div>
    </div>
  );
}
