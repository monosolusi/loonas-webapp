import React from "react";

export type CreateIncomingInvoiceLayoutProps = {
  recipients: React.ReactNode;
  addClient: React.ReactNode;
  invoices: React.ReactNode;
  clientBankAccount: React.ReactNode;
  addPartnerBankAccount: React.ReactNode;
  selectPaymentMethod: React.ReactNode;
};
