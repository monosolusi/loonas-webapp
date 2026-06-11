"use client";

import { TextArea } from "@/core/presentations/components/text-area";
import { useAddItem } from "@/app/(authenticated)/invoices/outgoing/create/@items/_providers/add-item";

export function DescriptionInput() {
  const { description, setDescription } = useAddItem();

  return <TextArea title="Deskripsi" placeholder="Deskripsi opsional untuk item ini" rows={2} value={description} onChange={setDescription} />;
}
