"use client";

import Image from "next/image";
import { MenuItem } from "@headlessui/react";
import { useAuth } from "@clerk/nextjs";
import { useMemo } from "react";

export function HeaderSignOutMenu() {
  const { signOut, isLoaded } = useAuth();

  const onClick = async () => {
    if (disabled) return;
    await signOut({ redirectUrl: "/sign-in" });
  };

  const disabled = useMemo(() => {
    return !isLoaded;
  }, [isLoaded]);

  return (
    <MenuItem
      as="div"
      className="hover:bg-error-300/5 text-error-300 disabled:curosr-not-allowed flex cursor-pointer flex-row items-center gap-x-2 p-3 hover:rounded-lg"
      onClick={onClick}
      disabled={disabled}
    >
      <Image src="/assets/images/sign-out-icon-neutral-300-w16-h16.svg" alt="Sign Out Icon" width={16} height={16} />
      <div className="text-sm leading-4 font-semibold">Keluar</div>
    </MenuItem>
  );
}
