import React from "react";
import clsx from "clsx";

interface TextHeadingWithUnderlineProps {
  children: React.ReactNode;
  className?: string;
}

export function TextHeadingWithUnderline(props: TextHeadingWithUnderlineProps) {
  return (
    <div className={clsx("relative mb-2", props.className)}>
      <h1 className="relative inline-block text-3xl font-bold tracking-tight text-gray-900">
        {props.children}
        <span className="bg-primary-default absolute -bottom-2 left-0 h-1 w-3/4"></span>
      </h1>
    </div>
  );
}
