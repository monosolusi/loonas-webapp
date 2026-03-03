import { LoonasDialog } from "@/core/presentations/components/loonas-dialog";
import { DialogTitle } from "@headlessui/react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { PrimaryButton } from "@/core/presentations/components/buttons/primary-button";
import { useRouter } from "next/navigation";

export function HasNoAccountErrorDialog() {
  const router = useRouter();

  const handleCreateBankAccountClick = () => {
    router.push("/settings/bank-accounts/create");
  };

  return (
    <LoonasDialog
      width="md"
      open={true}
      onClose={() => {}}
    >
      <div>
        <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-red-100">
          <ExclamationTriangleIcon aria-hidden="true" className="size-6 text-red-600" />
        </div>
        <div className="mt-3 text-center sm:mt-5">
          <DialogTitle as="h3" className="text-base font-semibold text-gray-900">
            Belum Ada Rekening Bank
          </DialogTitle>
          <div className="mt-2">
            <p className="text-sm text-gray-500">
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
