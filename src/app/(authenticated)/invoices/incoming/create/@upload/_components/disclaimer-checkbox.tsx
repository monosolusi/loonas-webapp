"use client";

import React from "react";
import { LoonasCheckbox } from "@/core/presentations/components/loonas-checkbox";

interface DisclaimerCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  description: string;
}

export function DisclaimerCheckbox(props: DisclaimerCheckboxProps) {
  return (
    <LoonasCheckbox checked={props.checked} onChange={props.onChange}>
      {props.description}
    </LoonasCheckbox>
  );
}
