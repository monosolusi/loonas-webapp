"use client";

import { useId } from "react";
import Image from "next/image";
import clsx from "clsx";
import {
  NationalityAvailability,
  UNAVAILABLE_NATIONALITY_CHIP_LABEL,
} from "@/app/(user)/onboarding/account/_utils/nationality-options";
import { StatusChip } from "@/core/presentations/components/status-chip";

type NationalityRadioItemProps = {
  name: string;
  uncheckedIconPath: string;
  checkedIconPath: string;
  title: string;
  description: string;
  /** The union, not a `disabled` boolean — an unselectable card cannot exist without its reason. */
  availability: NationalityAvailability;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
};

/**
 * One citizenship card. Private to `nationality-radio-group.tsx`.
 *
 * QA finding F10: the unselectable card used to be `opacity-50` and nothing else — inert with no
 * explanation. Two rules come out of that fix and both are load-bearing:
 *
 * 1. Recession comes from COLOR, never opacity. The onboarding pane is white, so any text inside a
 *    50%-opacity wrapper composites against white: `text-neutral-300` (#323636, 11.9:1) collapses to
 *    ~2.8:1 and even `text-neutral-500` only reaches ~3.6:1. No token survives it.
 * 2. The chip and the reason sentence carry the message; the faint fill is a supporting cue only
 *    (PRODUCT.md: never rely on color alone). Because the native `disabled` attribute removes the
 *    input from tab order, the primary assistive-tech route is browse/virtual-cursor mode where both
 *    read as ordinary page text — which is exactly why the reason must be visible text and never a
 *    hover-only tooltip.
 */
export function NationalityRadioItem(props: NationalityRadioItemProps) {
  const titleId = useId();
  const chipId = useId();
  const descriptionId = useId();
  const reasonId = useId();

  const unavailable = !props.availability.selectable;
  const reason = props.availability.selectable ? undefined : props.availability.reason;

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    props.onChange?.(e.target.checked);
  };

  return (
    <label
      className={clsx(
        // `h-full` matters: the unselectable card gains a third line, and without it the enabled
        // card sits short and top-aligned inside its stretched `flex-1` wrapper.
        "group has-checked:outline-primary-300 relative flex h-full flex-row gap-3 rounded-xl border-2 border-neutral-100 p-4 has-checked:outline-2 has-checked:-outline-offset-2 sm:p-6",
        // The input sets `focus:outline-none` and `has-checked:outline` is SELECTION, not focus, so
        // the keyboard user previously had no focus indicator at all (WCAG 2.4.7). A ring rather
        // than an outline, so it composes with the selection outline instead of fighting it, and
        // `ring-primary-300` at FULL opacity — #007BFF is 3.98:1, which clears the 3:1 non-text bar
        // while every `/NN` opacity variant fails it.
        "has-[:focus-visible]:ring-primary-300 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-offset-2",
        // Deliberately near-invisible (≈#F5F6F6 on white): it matches the icon tile's `bg-[#F5F5F5]`
        // so the card reads as one inert slab, where a heavy grey would fight DESIGN.md's flat
        // border-not-shadow system. Not `border-dashed` — `Dropzone` owns that in this vocabulary
        // and it would read "drop a file here".
        unavailable ? "cursor-not-allowed bg-neutral-100/25" : "cursor-pointer",
      )}
    >
      <input
        type="radio"
        name={props.name}
        checked={props.checked}
        onChange={onChange}
        // Native `disabled`, never a focusable `aria-disabled`: the F9 `resolveNationalityChange`
        // invariant depends on the click never firing. No `aria-disabled` alongside it either —
        // that is redundant beside the native state per ARIA-in-HTML.
        disabled={unavailable}
        aria-labelledby={unavailable ? `${titleId} ${chipId}` : titleId}
        aria-describedby={unavailable ? `${descriptionId} ${reasonId}` : descriptionId}
        className="absolute inset-0 appearance-none focus:outline-none disabled:cursor-not-allowed"
      />
      <div className="group-has-checked:bg-primary-300/20 flex size-10 shrink-0 flex-col items-center justify-center rounded-xl bg-[#F5F5F5]">
        {/* Decorative: the label already names the option. */}
        <Image className="group-has-checked:hidden" src={props.uncheckedIconPath} alt="" width={20} height={20} />
        <Image className="hidden group-has-checked:block" src={props.checkedIconPath} alt="" width={20} height={20} />
      </div>
      <div className="flex flex-col gap-1">
        <div className="flex flex-row items-center gap-2">
          <span id={titleId} className={clsx("text-base leading-5 font-medium", unavailable && "text-neutral-300")}>
            {props.title}
          </span>
          {unavailable && (
            // `variant="neutral"` (bg-neutral-100 / text-neutral-400, 12.3:1) — a state label, not a
            // problem. Not `warning`: nothing is wrong here, and `bg-warning-50` is invisible on
            // white. The wrapper carries the id because `StatusChip` takes no `id` prop.
            <span id={chipId}>
              <StatusChip label={UNAVAILABLE_NATIONALITY_CHIP_LABEL} variant="neutral" compact />
            </span>
          )}
        </div>
        <span id={descriptionId} className="text-sm leading-4 font-normal text-neutral-200">
          {props.description}
        </span>
        {reason && (
          <span id={reasonId} className="mt-0.5 text-xs leading-4 font-normal text-neutral-300">
            {reason}
          </span>
        )}
      </div>
    </label>
  );
}
