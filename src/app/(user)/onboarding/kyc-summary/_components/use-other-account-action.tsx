"use client";

import { useGetUserStatus } from "@/features/user/presentation/hooks/use-get-user-status";
import { useOrganizationList } from "@clerk/nextjs";

export function UseOtherAccountAction() {
  const { status } = useGetUserStatus();
  const { isLoaded, setActive } = useOrganizationList();

  const onClick = async () => {
    if (!isLoaded) return;
    setActive({ organization: null, redirectUrl: "/accounts" });
  };

  if (!status) return null;
  if (status.approvedAccount.count === 0) return null;
  return (
    <div
      className="text-primary-300 w-full cursor-pointer text-sm leading-5 capitalize hover:underline"
      onClick={onClick}
    >
      Pakai Akun Lainnya
    </div>
  );
}
