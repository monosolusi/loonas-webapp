"use client";

import { PrimaryButton } from "@/core/presentations/components/buttons/primary-button";
import Image from "next/image";
import React from "react";

type NextButtonProps = {
  onClick: () => void;
};

/**
 * Display component only — it holds no context and decides nothing about whether advancing is
 * allowed. Its personal and business implementations own that, because each has to consume its
 * own account-type hook (`usePersonalAccountData` throws outright when the selected type is
 * business, so a single shared implementation is impossible).
 */
export function NextButton(props: NextButtonProps) {
  return (
    <PrimaryButton
      type="button"
      label="Selanjutnya"
      rightIcon={
        <Image src="/assets/images/arrow-right-icon-white-w16-h16.svg" alt="Arrow Right" width={16} height={16} />
      }
      onClick={props.onClick}
    />
  );
}
