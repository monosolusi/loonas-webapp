"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { InformationCircleIcon } from "@heroicons/react/20/solid";

type MarginControlProps = {
  value: number;
  onChange: (value: number) => void;
  loading?: boolean;
};

// Slider visual range is 0–100; numeric input accepts 0–1000 (BE contract).
const SLIDER_MIN = 0;
const SLIDER_MAX = 100;
const MARGIN_MIN = 0;
const MARGIN_MAX = 1000;
const MARGIN_STEP = 0.01;
const DEBOUNCE_MS = 350;

type ClampHint = "min" | "max" | null;

export function MarginControl({ value, onChange, loading = false }: MarginControlProps) {
  const [localValue, setLocalValue] = useState(value);
  const [clampHint, setClampHint] = useState<ClampHint>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const clampHintTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync local value when external value changes (e.g. on initial load)
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const dismissClampHint = useCallback(() => {
    if (clampHintTimerRef.current) clearTimeout(clampHintTimerRef.current);
    clampHintTimerRef.current = setTimeout(() => setClampHint(null), 3000);
  }, []);

  const commitValue = useCallback(
    (raw: number) => {
      // Clamp to [MARGIN_MIN, MARGIN_MAX], snap to MARGIN_STEP
      let clamped = Math.max(MARGIN_MIN, Math.min(MARGIN_MAX, raw));
      clamped = Math.round(clamped / MARGIN_STEP) * MARGIN_STEP;
      clamped = parseFloat(clamped.toFixed(2));

      if (raw < MARGIN_MIN) {
        setClampHint("min");
        dismissClampHint();
      } else if (raw > MARGIN_MAX) {
        setClampHint("max");
        dismissClampHint();
      } else {
        setClampHint(null);
      }

      setLocalValue(clamped);

      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        onChange(clamped);
      }, DEBOUNCE_MS);
    },
    [onChange, dismissClampHint],
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (clampHintTimerRef.current) clearTimeout(clampHintTimerRef.current);
    };
  }, []);

  function handleSliderChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = parseFloat(e.target.value);
    commitValue(raw);
  }

  function handleNumericChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = parseFloat(e.target.value);
    if (!isNaN(raw)) commitValue(raw);
  }

  function handleNumericBlur(e: React.FocusEvent<HTMLInputElement>) {
    const raw = parseFloat(e.target.value);
    if (isNaN(raw)) {
      setLocalValue(value);
    } else {
      commitValue(raw);
    }
  }

  const sliderValue = Math.min(localValue, SLIDER_MAX);
  const showSliderCaption = localValue > SLIDER_MAX;

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex flex-row items-center justify-between">
        <span className="text-sm font-medium text-neutral-500">Target Margin</span>
        <span className="text-sm font-semibold text-primary-400">{localValue.toLocaleString("id-ID")}%</span>
      </div>

      {/* Slider — visual range 0–100 */}
      <div className="h-11 flex items-center">
        <input
          type="range"
          min={SLIDER_MIN}
          max={SLIDER_MAX}
          step={MARGIN_STEP}
          value={sliderValue}
          onChange={handleSliderChange}
          disabled={loading}
          aria-valuemin={SLIDER_MIN}
          aria-valuemax={SLIDER_MAX}
          aria-valuenow={sliderValue}
          aria-valuetext={`${localValue}% margin`}
          aria-label="Target margin"
          className={clsx("h-1.5 w-full cursor-pointer appearance-none rounded-full bg-neutral-100 accent-primary-300", loading && "opacity-70")}
        />
      </div>

      {showSliderCaption && (
        <p className="text-xs text-neutral-300">
          Slider menampilkan 0–100%. Nilai di atas 100% hanya bisa diatur lewat kolom angka.
        </p>
      )}

      {/* Numeric input */}
      <div className="flex flex-row items-center gap-x-2">
        <label htmlFor="margin-numeric-input" className="sr-only">
          Target Margin Persen
        </label>
        <input
          id="margin-numeric-input"
          type="number"
          min={MARGIN_MIN}
          max={MARGIN_MAX}
          step={MARGIN_STEP}
          value={localValue}
          onChange={handleNumericChange}
          onBlur={handleNumericBlur}
          disabled={loading}
          aria-label={`Target margin, nilai saat ini ${localValue}%, minimum ${MARGIN_MIN}%, maksimum ${MARGIN_MAX}%`}
          className={clsx(
            "h-11 flex-1 rounded-lg border border-neutral-100 px-3 text-sm text-neutral-500 focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-300/20",
            loading && "cursor-wait opacity-70",
          )}
        />
        <span className="text-sm text-neutral-400">%</span>
      </div>

      {clampHint === "min" && (
        <p className="flex items-center gap-x-1 text-xs text-neutral-300">
          <InformationCircleIcon className="size-3 shrink-0" />
          Margin minimum adalah 0%.
        </p>
      )}
      {clampHint === "max" && (
        <p className="flex items-center gap-x-1 text-xs text-neutral-300">
          <InformationCircleIcon className="size-3 shrink-0" />
          Margin maksimum adalah 1.000%.
        </p>
      )}
    </div>
  );
}
