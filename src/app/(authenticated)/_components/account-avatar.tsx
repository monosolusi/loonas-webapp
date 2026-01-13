import clsx from "clsx";
import { ACCOUNT_AVATAR_COLOR_MAP } from "@/core/utilities/global-vars";
import { useMemo } from "react";
import { AccountType } from "@/features/account/domain/enums/account-type";

type AccountAvatarProps = {
  size?: number;
  type: AccountType;
};

export function AccountAvatar(props: AccountAvatarProps) {
  const size = useMemo(() => {
    return props.size ?? 8;
  }, [props.size]);

  return (
    <div
      className={clsx(
        `size-${size}`,
        "flex flex-col items-center justify-center rounded-full border text-xs leading-4 font-bold",
        ACCOUNT_AVATAR_COLOR_MAP[props.type],
      )}
    ></div>
  );
}
