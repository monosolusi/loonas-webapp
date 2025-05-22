import { v4 as uuid } from "uuid";
import { ClientTable } from "@/app/(authenticated)/clients/_components/client-table";
import React from "react";

export function ClientTableImpl() {
  return (
    <ClientTable data={[
      {
        id: uuid(),
        name: "PT. Tumbuh Kembang Indonesia",
        email: "halo@tumbuh.com",
        phoneNumber: "+628123456789"
      }
    ]} />
  );
}
