import { BankEntity } from "@/features/bank/domain/entities/bank";
import React from "react";

export type BankComboboxProps = {
  selectedBank?: BankEntity;
  setSelectedBank?: React.Dispatch<React.SetStateAction<BankEntity | undefined>>;
};
