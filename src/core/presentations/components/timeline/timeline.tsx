import { ReactNode } from "react";

interface TimelineProps {
  children: ReactNode;
}

/**
 * Vertical list container for {@link TimelineItem}s. Owns the spacing rhythm between steps so
 * callers only supply the items.
 */
export function Timeline({ children }: TimelineProps) {
  return <div className="flex flex-col gap-y-8">{children}</div>;
}
