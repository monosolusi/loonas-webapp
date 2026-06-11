import clsx from "clsx";
import { ACCOUNT_AVATAR_COLOR_MAP } from "@/core/utilities/global-vars";
import { useMemo } from "react";
import { AccountType } from "@/features/account/domain/enums/account-type";

type AccountAvatarProps = {
  size?: number;
  type: AccountType;
  name?: string;
};

function getInitials(name: string): string {
  const words = name.trim().split(/\s+/);
  if (words.length === 1) return words[0][0].toUpperCase();
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
}

export function AccountAvatar(props: AccountAvatarProps) {
  const size = useMemo(() => {
    return props.size ?? 8;
  }, [props.size]);

  const initials = useMemo(() => {
    return props.name ? getInitials(props.name) : undefined;
  }, [props.name]);

  return (
    <div
      className={clsx(
        `size-${size}`,
        "flex flex-col items-center justify-center rounded-full border text-xs leading-4 font-bold",
        ACCOUNT_AVATAR_COLOR_MAP[props.type],
      )}
    >
      {initials}
    </div>
  );
}
