"use client";

import { useGetUserStatus } from "@/features/user/presentation/hooks/use-get-user-status";
import { useOrganizationList } from "@clerk/nextjs";
import clsx from "clsx";

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
    <button
      type="button"
      className={clsx(
        "text-primary-300 w-full text-sm leading-5 capitalize hover:underline",
        "appearance-none border-0 bg-transparent p-0",
        "focus-visible:ring-primary-300 rounded focus-visible:ring-2",
      )}
      onClick={onClick}
    >
      Pakai Akun Lainnya
    </button>
  );
}
