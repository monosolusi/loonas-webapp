import clsx from "clsx";

/**
 * @deprecated Use `SectionCard` from `@/core/presentations/components/section-card` instead.
 */
interface CardProps {
  children?: React.ReactNode;
  className?: string;
  onClick?: () => void;
  effect?: { hover?: boolean; selectable?: boolean };
}

/**
 * @deprecated Use `SectionCard` from `@/core/presentations/components/section-card` instead.
 */
export function Card(props: CardProps) {
  return (
    <div
      className={clsx(
        "rounded-md bg-white shadow-sm",
        props.className,
        "overflow-hidden",
        props.effect?.hover && "transition-all duration-200 hover:bg-gray-50 hover:shadow-md",
        props.effect?.selectable && "cursor-pointer",
      )}
      onClick={props.onClick}
    >
      <div className="px-4 py-5 sm:p-6">{props.children}</div>
    </div>
  );
}
