import Image from "next/image";
import clsx from "clsx";

export type TimelineItemState = "current" | "future" | "past";

const PAST_ICON_SRC = "/assets/images/check-icon-white-w18-h18.svg";

interface TimelineItemProps {
  state: TimelineItemState;
  iconSrc?: string;
  title: string;
  description: string;
  activeLabel?: string;
  timestamp?: string;
  /** Suppresses the trailing connector on the final step. */
  isLast?: boolean;
}

// Node = the circular marker on the rail. Past is a confident filled Lunas-blue dot with a white
// check; current is a blue ring on pale blue; future is a hollow, muted placeholder.
const NODE_STYLES: Record<TimelineItemState, string> = {
  past: "border border-primary-300 bg-primary-300",
  current: "border-2 border-primary-300 bg-primary-50",
  future: "border border-neutral-100 bg-white",
};

// The segment below a node belongs to the step it descends from: solid blue once that step is
// done, light grey while it (and everything after) is still ahead.
const CONNECTOR_STYLES: Record<TimelineItemState, string> = {
  past: "bg-primary-300",
  current: "bg-neutral-100",
  future: "bg-neutral-100",
};

const TITLE_STYLES: Record<TimelineItemState, string> = {
  past: "text-neutral-500",
  current: "text-neutral-500",
  future: "text-neutral-200",
};

const DESCRIPTION_STYLES: Record<TimelineItemState, string> = {
  past: "text-neutral-300",
  current: "text-neutral-300",
  future: "text-neutral-200",
};

export function TimelineItem({
  state,
  iconSrc,
  title,
  description,
  activeLabel = "Sedang berlangsung",
  timestamp,
  isLast,
}: TimelineItemProps) {
  const resolvedIconSrc = state === "past" ? PAST_ICON_SRC : iconSrc;
  const isCurrent = state === "current";

  return (
    <div className="flex flex-row gap-x-4">
      {/* Rail: node + connector down to the next step. Stretches to the content height so the
          connector (flex-1) always reaches the next node, even when descriptions wrap. */}
      <div className="flex flex-col items-center">
        <div
          className={clsx(
            "flex size-9 shrink-0 items-center justify-center rounded-full",
            NODE_STYLES[state],
          )}
        >
          {resolvedIconSrc && (
            <Image
              src={resolvedIconSrc}
              alt=""
              width={18}
              height={18}
              className={clsx(state === "future" && "opacity-40")}
            />
          )}
        </div>
        {!isLast && <div className={clsx("mt-1 w-0.5 min-h-[28px] flex-1 rounded-full", CONNECTOR_STYLES[state])} />}
      </div>

      {/* Content — bottom padding sets the vertical rhythm the connector fills into. */}
      <div className={clsx("flex flex-1 flex-col", !isLast && "pb-7")}>
        <div className={clsx("flex flex-col gap-y-1", isCurrent && "rounded-lg bg-primary-50 px-3 py-2.5")}>
          <div className={clsx("text-sm font-semibold", TITLE_STYLES[state])}>{title}</div>
          {description && <div className={clsx("text-sm leading-5", DESCRIPTION_STYLES[state])}>{description}</div>}
          {timestamp && <div className="text-xs leading-4 text-neutral-200">{timestamp}</div>}

          {/* Live indicator — only for the step currently in progress. */}
          {isCurrent && (
            <div className="mt-1 inline-flex items-center gap-x-1.5 text-xs leading-4 font-semibold text-primary-400">
              <span className="relative flex size-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary-300 opacity-60" />
                <span className="relative inline-flex size-2 rounded-full bg-primary-300" />
              </span>
              {activeLabel}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
