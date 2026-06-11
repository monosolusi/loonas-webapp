import React from "react";

export type LoonasCheckboxProps = {
  checked: boolean;
  onChange?: (checked: boolean) => void | Promise<void>;
  children?: React.ReactNode;
  disabled?: boolean;
};
