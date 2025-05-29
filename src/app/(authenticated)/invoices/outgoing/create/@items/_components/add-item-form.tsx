"use client";

import React from "react";
import { useAddItem } from "@/app/(authenticated)/invoices/outgoing/create/@items/_providers/add-item";
import { ItemDetail } from "@/app/(authenticated)/invoices/outgoing/create/@items/_components/add-item-dialog";

interface AddItemFormProps {
  children: React.ReactNode;
  onSubmit?: (item: ItemDetail) => void | Promise<void>;
}

export function AddItemForm(props: AddItemFormProps) {
  const {
    name,
    description,
    qty,
    price,
    taxType,
    tax,
    taxBase,
    discountType,
    discount,
    total,
    mustRecalculateTax,
    clearInput,
  } = useAddItem();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!clearInput) return;
    if (!props.onSubmit) return;
    if (name.trim() === "" || mustRecalculateTax) return;

    props.onSubmit({
      name: name,
      description: description,
      qty: qty,
      price: price,
      taxType: taxType,
      tax: tax,
      taxBase: taxBase,
      discountType: discountType,
      discount: discount,
      total: total,
    });

    clearInput();
  };

  return <form onSubmit={handleSubmit}>{props.children}</form>;
}
