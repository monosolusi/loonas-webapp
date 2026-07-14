import Image from "next/image";
import clsx from "clsx";

export type TimelineItemState = "current" | "future" | "past";

const PAST_ICON_SRC = "/assets/images/double-check-icon-neutral-500-w18-h18.svg";

interface TimelineItemProps {
  state: TimelineItemState;
  iconSrc?: string;
  title: string;
  description: string;
  activeLabel?: string;
  timestamp?: string;
}

const ICON_CONTAINER_STYLES: Record<TimelineItemState, string> = {
  current: "border-neutral-500",
  future: "border-neutral-200",
  past: "bg-primary-50 border-neutral-500",
};

const TEXT_STYLES: Record<TimelineItemState, string> = {
  current: "",
  future: "text-neutral-200",
  past: "",
};

export function TimelineItem({
  state,
  iconSrc,
  title,
  description,
  activeLabel = "Sedang berlangsung...",
  timestamp,
}: TimelineItemProps) {
  const resolvedIconSrc = state === "past" ? PAST_ICON_SRC : iconSrc;

  return (
    <div className="flex flex-row gap-x-4">
      {/* Icon */}
      <div
        className={clsx(
          "flex size-10 flex-row items-center justify-center rounded-full border",
          ICON_CONTAINER_STYLES[state],
        )}
      >
        {resolvedIconSrc && <Image src={resolvedIconSrc} alt="" width={18} height={18} />}
      </div>
      <div className="flex flex-col items-start gap-y-2">
        <div className="flex flex-col gap-y-1">
          <div className={clsx("text-sm leading-3.5 font-bold", TEXT_STYLES[state])}>{title}</div>
          <div className={clsx("flex flex-col gap-y-1 text-sm leading-6", TEXT_STYLES[state])}>
            <div>{description}</div>
            {timestamp && <div>{timestamp}</div>}
          </div>
        </div>

        {/* Active Indicator - only for current state */}
        {state === "current" && (
          <div className="bg-primary-50 flex flex-row gap-x-1 rounded-sm border border-transparent p-1">
            <div className="flex size-4 flex-row items-center justify-center">
              <div className="size-2 rounded-full bg-neutral-500"></div>
            </div>
            <div className="text-xs leading-4 font-semibold">{activeLabel}</div>
          </div>
        )}
      </div>
    </div>
  );
}
