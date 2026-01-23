"use client";

import { useAddItem } from "@/app/(authenticated)/invoices/outgoing/create/@items/_providers/add-item";
import { TextInput } from "@/core/presentations/components/text-inputs/text-input";

export function NameInput() {
  const { name, setName } = useAddItem();

  return <TextInput title="Nama" value={name} onChange={setName} required />;
}
