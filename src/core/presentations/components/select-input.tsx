"use client";

import React, { useId, useMemo } from "react";
import Image from "next/image";
import clsx from "clsx";
import { InfoTooltip } from "@/core/presentations/components/info-tooltip";

export type SelectOption = {
  label: string;
  value: string;
};

type SelectInputBaseProps = {
  description?: string;
  error?: string | null;
  options: SelectOption[];
  onChange?: (value: string) => void;
  placeholder?: string;
  leftIcon?: React.ReactNode; // Must be width and height props of 20x20
  tooltip?: React.ReactNode;
};

type SelectInputWithLabel = SelectInputBaseProps & {
  label: string;
  noLabel?: false;
};

type SelectInputWithoutLabel = SelectInputBaseProps & {
  label?: string;
  noLabel: true;
};

export type SelectInputProps = (SelectInputWithLabel | SelectInputWithoutLabel) &
  Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "onChange">;

/**
 * Custom select input component with left icon as optional.
 * Uses chevron-down icon for the dropdown arrow.
 *
 * @param props
 * @constructor
 */
export function SelectInput(props: SelectInputProps) {
  const messageId = useId();

  const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (props.onChange) props.onChange(e.target.value);
  };

  const cleanedInputProps = useMemo(() => {
    // `error` must be destructured out here with the other non-DOM props — leaving it in would
    // spread onto the native <select> as an unknown attribute.
    const { leftIcon, label, onChange, description, error, options, placeholder, noLabel, tooltip, ...cleanedProps } =
      props;
    // A caller passing `value={undefined}` would otherwise spread onto `<select>` as an
    // UNCONTROLLED element — the browser then auto-selects the first non-disabled
    // <option> per the HTML select-reset algorithm, silently committing a phantom value
    // while the placeholder overlay makes the field look empty. Coerce to "" so the
    // element is always controlled and matches the placeholder-driven `hasValue` check
    // below (mirrors TextInput's `value: cleanedProps.value ?? ""`).
    return Object.assign({}, cleanedProps, {
      value: cleanedProps.value ?? "",
    }) as React.SelectHTMLAttributes<HTMLSelectElement>;
  }, [props]);

  const hasValue = props.value !== undefined && props.value !== "";
  const hasError = !!props.error;

  // The error/description span used to be a bare sibling with no id, so assistive tech never
  // announced it on focus — the message was visible but not programmatically associated. Exactly one
  // of the two ever renders (error XOR description), so a single id is enough. Composed with any
  // caller-supplied `aria-describedby` rather than replacing it: `SelectInputProps` extends
  // `SelectHTMLAttributes`, so a caller may legitimately pass one, and setting the attribute after
  // the props spread would otherwise clobber it.
  const hasMessage = hasError || !!props.description;
  const describedBy =
    [cleanedInputProps["aria-describedby"], hasMessage ? messageId : undefined].filter(Boolean).join(" ") || undefined;

  return (
    // No `opacity-50` anywhere in this component, at any level. A fade composites every descendant
    // against the white page, so it dims the error/description line — which on a disabled field is
    // exactly the copy explaining WHY it is disabled (`text-neutral-200` at 50% on white is ~1.35:1,
    // i.e. not there). It also halves any fill on the same node: `bg-neutral-100/25` under
    // `opacity-50` renders as ≈#FAFAFA instead of ≈#F5F6F6, which is why the row's fill was invisible
    // while the fade was still doing all the signalling. Recession comes from COLOR throughout —
    // same rule as `nationality-radio-item.tsx`.
    <div className="flex flex-col gap-2 transition-all">
      {!props.noLabel && (
        <span
          className={clsx("flex items-center gap-x-1.5 text-base transition-all", props.disabled && "text-neutral-300")}
        >
          {props.label}
          {props.required && <span className="text-red-500"> *</span>}
          {props.tooltip && <InfoTooltip text={props.tooltip} />}
        </span>
      )}
      <div
        className={clsx(
          "relative flex h-11 flex-row items-center gap-3 rounded-lg border border-solid p-3 transition-all",
          hasError ? "border-red-500" : "border-neutral-100",
          props.disabled
            ? // `bg-neutral-50` was a no-op — it is #FFFFFF in this project, identical to the page.
              // `bg-neutral-100/25` (≈#F5F6F6) is the same faint fill the unselectable nationality
              // card uses, so both disabled treatments read as one vocabulary. The border stays at
              // full strength per DESIGN.md's disabled spec: Mist border, Mist fill, Charcoal text.
              "cursor-not-allowed bg-neutral-100/25"
            : hasError
              ? "focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-500/20"
              : "focus-within:ring-primary-300/20 focus-within:border-primary-300 focus-within:ring-2",
        )}
      >
        {props.leftIcon && <div className="shrink-0">{props.leftIcon}</div>}
        {!hasValue && props.placeholder && (
          <span className="pointer-events-none absolute left-3 text-base text-neutral-200">{props.placeholder}</span>
        )}
        <select
          {...cleanedInputProps}
          onChange={onChange}
          aria-invalid={hasError || undefined}
          aria-describedby={describedBy}
          className={clsx(
            "flex-1 appearance-none bg-transparent text-base outline-none",
            props.disabled ? "cursor-not-allowed" : "cursor-pointer",
            // Mutually exclusive rather than stacked: two `color` utilities of equal specificity are
            // resolved by stylesheet order, which clsx cannot influence, so the placeholder-hiding
            // `text-transparent` has to win by being the only one emitted.
            !hasValue ? "text-transparent" : props.disabled ? "text-neutral-300" : undefined,
          )}
        >
          <option value="" disabled></option>
          {props.options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {/*
          The chevron is a fixed-colour SVG asset, so it cannot be receded by token. Opacity is
          acceptable here and nowhere else in this component: the rule protects COPY, and there is no
          text inside a decorative arrow.
        */}
        <div className={clsx("pointer-events-none shrink-0", props.disabled && "opacity-60")}>
          <Image
            src="/assets/images/chevron-down-icon-neutral-200-w20-h20.svg"
            alt="Dropdown arrow"
            width={20}
            height={20}
          />
        </div>
      </div>
      {hasError && (
        <span id={messageId} className="text-xs leading-4 font-normal text-red-500">
          {props.error}
        </span>
      )}
      {!hasError && props.description && (
        // Darkened while disabled, because that is when the description is doing the work of
        // explaining WHY: `text-neutral-300` is 10.9:1 on the disabled fill, where `text-neutral-200`
        // is 1.88:1 on white. Left at `text-neutral-200` when enabled so no other consumer shifts.
        // NOTE: `text-neutral-200` as the app-wide secondary/placeholder token genuinely fails AA,
        // but it is established across the whole app — changing it here only would make these fields
        // inconsistent with everything else for no user gain. That is its own app-wide ticket.
        <span
          id={messageId}
          className={clsx(
            "text-xs leading-4 font-normal transition-all",
            props.disabled ? "text-neutral-300" : "text-neutral-200",
          )}
        >
          {props.description}
        </span>
      )}
    </div>
  );
}
