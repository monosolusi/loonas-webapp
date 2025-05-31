"use client";

import { SenderInformation } from "@/app/(authenticated)/invoices/outgoing/create/@review/_components/sender-information";
import { useSelectedAccountProvider } from "@/features/authentication/presentation/providers/selected-account";

export function SenderInformationImpl() {
  const { selectedAccount } = useSelectedAccountProvider();

  if (!selectedAccount) return null;
  return <SenderInformation address={selectedAccount.fullAddress} senderName={selectedAccount.fullName} />;
}
