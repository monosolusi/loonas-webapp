import { ReactNode } from "react";

interface TimelineProps {
  children: ReactNode;
}

/**
 * Vertical list container for {@link TimelineItem}s. Each item draws its own connector segment
 * down to the next node, so the container only stacks them — spacing lives inside the items to
 * keep the connecting line continuous.
 */
export function Timeline({ children }: TimelineProps) {
  return <div className="flex flex-col">{children}</div>;
}
