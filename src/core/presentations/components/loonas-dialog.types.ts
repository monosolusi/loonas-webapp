import React from "react";

export type LoonasDialogProps = {
  children?: React.ReactNode;
  title?: string;
  width?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "6xl" | "7xl" | "full";
  open: boolean;
  onClose?: (() => void) | (() => Promise<void>);
  allowDismiss?: boolean;
};
