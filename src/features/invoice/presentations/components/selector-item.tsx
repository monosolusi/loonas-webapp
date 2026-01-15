import Image from "next/image";
import { useMemo } from "react";
import { SelectorItemProps, State, StateValue } from "@/features/invoice/presentations/components/selector-item.types";

const STATE: Record<State, StateValue> = {
  active: {
    backgroundColor: "bg-primary-300/10",
    avatarBackground: "bg-primary-300",
    avatarForeground: "text-white",
  },
  default: {
    backgroundColor: "bg-white",
    avatarBackground: "bg-neutral-100",
    avatarForeground: "text-neutral-500",
  },
};

export function SelectorItem(props: SelectorItemProps) {
  const state = useMemo(() => props.state ?? "default", [props.state]);

  const bottomBorder = useMemo(() => {
    const showBorder = props.showBorder ?? true;
    if (showBorder) return "border-b border-b-neutral-100";
    else return "";
  }, [props.showBorder]);

  const { backgroundColor, avatarBackground, avatarForeground } = useMemo(() => STATE[state], [state]);

  const avatarContent = useMemo(() => {
    return props.title
      .split(" ")
      .slice(0, 2)
      .map((word) => word.charAt(0).toUpperCase())
      .join("");
  }, [props.title]);

  return (
    <div className={`flex flex-row items-center gap-x-4 ${bottomBorder} px-4 py-5 ${backgroundColor} cursor-pointer`}>
      <div className={`size-10 rounded-full ${avatarBackground} flex flex-col items-center justify-center`}>
        <div className={`${avatarForeground} text-center text-sm leading-5 font-bold`}>{avatarContent}</div>
      </div>
      <div className="flex flex-1 flex-col">
        <div className="text-base leading-6 font-semibold text-neutral-500">{props.title}</div>
        {props.description && <div className="text-sm leading-5">{props.description}</div>}
      </div>

      {state === "active" && (
        <div className="size-6">
          <Image
            src="/assets/images/check-circle-icon-primary-300-w16-h16.svg"
            alt="check icon"
            width={24}
            height={24}
          />
        </div>
      )}
    </div>
  );
}
