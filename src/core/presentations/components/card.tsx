import clsx from "clsx";

interface CardProps {
  children?: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function Card(props: CardProps) {
  return (
    <div className={clsx("rounded-md bg-white shadow-sm", props.className, "overflow-hidden")} onClick={props.onClick}>
      <div className="px-4 py-5 sm:p-6">{props.children}</div>
    </div>
  );
}
