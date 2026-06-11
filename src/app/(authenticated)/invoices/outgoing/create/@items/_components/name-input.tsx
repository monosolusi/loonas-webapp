"use client";

import { useAddItem } from "@/app/(authenticated)/invoices/outgoing/create/@items/_providers/add-item";
import { TextInput } from "@/core/presentations/components/text-inputs/text-input";

export function NameInput() {
  const { name, setName } = useAddItem();

  return <TextInput label="Nama Item" placeholder="Masukkan nama item" value={name} onChange={setName} required />;
}
