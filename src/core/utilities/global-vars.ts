import { AccountType } from "@/features/account/domain/enums/account-type";

export const ACCOUNT_AVATAR_COLOR_MAP = {
  [AccountType.PERSONAL]: "bg-primary-300/10 border-primary-300/20 text-primary-300",
  [AccountType.BUSINESS]: "bg-success-300/10 border-success-300/20 text-success-300",
};
