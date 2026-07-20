"use client";

import Link from "next/link";
import clsx from "clsx";
import { ChevronRightIcon } from "@heroicons/react/16/solid";

type MobileListCardProps = {
  /** Primary line — the strongest identifier (name, title, number). */
  title: React.ReactNode;
  /** Secondary line under the title (e.g. invoice number, category). */
  subtitle?: React.ReactNode;
  /** Small tertiary line (e.g. date, quantity). */
  meta?: React.ReactNode;
  /** Top-right value — usually the money amount, kept bold and un-truncated. */
  trailingTop?: React.ReactNode;
  /** Bottom-right slot — usually a StatusChip. */
  trailingBottom?: React.ReactNode;
  /** Navigates on tap when provided (whole card is the target). */
  href?: string;
  /** Fires on tap when there is no href. */
  onClick?: () => void;
  /** Show a chevron affordance on the far right (defaults to true for links). */
  chevron?: boolean;
};

/**
 * The mobile counterpart of one table row for browse lists. Desktop keeps its
 * grid row (render it inside `hidden lg:block`); below `lg` render this card
 * inside `lg:hidden`. Provides consistent card chrome, tap target, and the
 * title / amount / status hierarchy across every list in the app.
 */
export function MobileListCard({
  title,
  subtitle,
  meta,
  trailingTop,
  trailingBottom,
  href,
  onClick,
  chevron,
}: MobileListCardProps) {
  const interactive = Boolean(href || onClick);
  const showChevron = chevron ?? interactive;

  const inner = (
    <div className="flex items-center gap-3 px-4 py-3.5">
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="truncate text-sm leading-5 font-semibold text-neutral-500">{title}</span>
        {subtitle !== undefined && (
          <span className="flex min-w-0 items-center gap-x-2 truncate text-sm leading-5 text-neutral-400">
            {subtitle}
          </span>
        )}
        {meta !== undefined && <span className="truncate text-xs leading-4 text-neutral-300">{meta}</span>}
      </div>

      {(trailingTop !== undefined || trailingBottom !== undefined) && (
        <div className="flex shrink-0 flex-col items-end gap-1">
          {trailingTop !== undefined && (
            <span className="text-sm leading-5 font-semibold whitespace-nowrap text-neutral-500">{trailingTop}</span>
          )}
          {trailingBottom}
        </div>
      )}

      {showChevron && <ChevronRightIcon className="size-4 shrink-0 text-neutral-200" />}
    </div>
  );

  const className = clsx(
    "block border-b border-neutral-100 last:border-b-0",
    interactive && "cursor-pointer transition-colors hover:bg-primary-50 active:bg-primary-50 motion-reduce:transition-none",
  );

  if (href) {
    return (
      <Link href={href} className={className}>
        {inner}
      </Link>
    );
  }

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={clsx(className, "w-full text-left")}>
        {inner}
      </button>
    );
  }

  return <div className={className}>{inner}</div>;
}
