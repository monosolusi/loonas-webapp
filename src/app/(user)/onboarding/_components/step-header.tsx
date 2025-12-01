import React from "react";

type StepHeaderProps = {
  title: string;
  description: string;
};

export function StepHeader(props: StepHeaderProps) {
  return (
    <div className="flex flex-col items-center gap-3">
      <span className="text-3xl leading-10 font-semibold tracking-tight text-neutral-500">{props.title}</span>
      <span className="text-base leading-6 font-normal text-neutral-200">{props.description}</span>
    </div>
  );
}
