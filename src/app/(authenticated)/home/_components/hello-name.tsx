"use client";

import { TextHeadingWithUnderline } from "@/core/presentations/components/text-heading-with-underline";
import { useSelectedAccountProvider } from "@/features/authentication/presentation/providers/selected-account";

export function HelloName() {
  const { selectedAccount } = useSelectedAccountProvider();

  if (!selectedAccount) return null;
  return <TextHeadingWithUnderline>👋 {selectedAccount.fullName}</TextHeadingWithUnderline>;
}
