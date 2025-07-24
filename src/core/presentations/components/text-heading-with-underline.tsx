import React from "react";

export function TextHeadingWithUnderline(props: { children: React.ReactNode }) {
  return (
    <div className="relative mb-2">
      <h1 className="relative inline-block text-3xl font-bold tracking-tight text-gray-900">
        {props.children}
        <span className="bg-primary-default absolute -bottom-2 left-0 h-1 w-3/4"></span>
      </h1>
    </div>
  );
}
