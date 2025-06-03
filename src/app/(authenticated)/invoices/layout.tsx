import React from "react";
import { MustHaveAccount } from "@/app/(authenticated)/invoices/_components/must-have-account";
import { MustVerifiedAccount } from "@/app/(authenticated)/invoices/_components/must-verified-account";

interface CreateInvoiceLayoutProps {
  children: React.ReactNode;
}

export default function CreateInvoiceLayout(props: CreateInvoiceLayoutProps) {
  return (
    <MustHaveAccount>
      <MustVerifiedAccount>{props.children}</MustVerifiedAccount>
    </MustHaveAccount>
  );
}
