"use client";

import React from "react";
import { LoonasCheckbox } from "@/core/presentations/components/loonas-checkbox";

export function DisclaimerCheckbox(props: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  description: string;
}) {
  return (
    <LoonasCheckbox checked={props.checked} onChange={props.onChange}>
      {props.description}
    </LoonasCheckbox>
  );
}
