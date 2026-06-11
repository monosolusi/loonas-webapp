import React from "react";
import clsx from "clsx";

type StepIndicatorProps = {
  totalSteps: number;
  currentStep: number;
};

export function StepIndicator(props: StepIndicatorProps) {
  return (
    <div className="mb-6 flex flex-row gap-2">
      {[...Array(props.totalSteps)].map((_, i) => (
        <div
          key={i}
          className={clsx(
            "h-1 w-full flex-1 rounded-full",
            i < props.currentStep ? "bg-primary-300" : "bg-neutral-100",
          )}
        ></div>
      ))}
    </div>
  );
}
