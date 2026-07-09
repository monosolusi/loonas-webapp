import { BusinessAccountEntity } from "@/features/account/domain/entities/business-account";
import { useGetCurrentAccount } from "@/features/account/presentation/hooks/use-get-current-account";

export function resolveMerchantName(account: ReturnType<typeof useGetCurrentAccount>["account"]): string {
  if (!account) return "";
  if (account instanceof BusinessAccountEntity) return account.company.name;
  if ("fullName" in account && typeof account.fullName === "string") return account.fullName;
  return "";
}
