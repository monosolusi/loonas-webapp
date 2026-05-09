"use client";

import { DialogTitle } from "@headlessui/react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { LoonasDialog } from "@/core/presentations/components/loonas-dialog";
import { PrimaryButton } from "@/core/presentations/components/buttons/primary-button";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { useGetCurrentAccount } from "@/features/account/presentation/hooks/use-get-current-account";
import { useListAccountBankAccout } from "@/features/bank/presentation/hooks/use-list-account-bank-account";

type RequireAccountBankAccountProps = {
  children: React.ReactNode;
};

export function RequireAccountBankAccount({ children }: RequireAccountBankAccountProps) {
  const { error, loading } = useListAccountBankAccout();
  const hasNoBankAccount =
    error instanceof ServerError && error.code === ErrorCodes.ACCOUNT_HAS_NO_BANK_ACCOUNT.code;

  if (loading) return <BankAccountCheckLoading />;
  if (hasNoBankAccount) return <NoBankAccountDialog />;
  return <>{children}</>;
}

function BankAccountCheckLoading() {
  return (
    <div className="flex h-full min-h-[60vh] items-center justify-center">
      <div className="size-8 animate-pulse rounded-full bg-neutral-100" />
    </div>
  );
}

function NoBankAccountDialog() {
  const router = useRouter();
  const { account } = useGetCurrentAccount();

  const handleCreateBankAccountClick = () => {
    const href = account ? `/accounts/${account.id}` : "/accounts";
    router.push(href);
  };

  return (
    <LoonasDialog width="md" open={true} onClose={() => {}}>
      <div>
        <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-error-50">
          <ExclamationTriangleIcon aria-hidden="true" className="size-6 text-error-500" />
        </div>
        <div className="mt-3 text-center sm:mt-5">
          <DialogTitle as="h3" className="text-base font-semibold text-neutral-500">
            Belum Ada Rekening Bank
          </DialogTitle>
          <div className="mt-2">
            <p className="text-sm text-neutral-300">
              Tambahkan rekening bank dulu, ya! Biar pembayaran dari invoice kamu bisa langsung diproses tanpa hambatan.
            </p>
          </div>
          <div className="mt-5 sm:mt-6">
            <PrimaryButton label="Daftarkan Rekening Kamu" onClick={handleCreateBankAccountClick} />
          </div>
        </div>
      </div>
    </LoonasDialog>
  );
}
