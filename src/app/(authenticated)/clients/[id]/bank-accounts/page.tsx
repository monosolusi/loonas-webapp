import React from "react";
import { BankAccountProvider } from "@/features/bank/presentation/providers/bank-account";
import { BankAccountImpl } from "@/app/(authenticated)/clients/[id]/bank-accounts/_components/bank-account-impl";

export default async function PartnerBankAccountPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex-1">
        <h2 className="text-base/7 font-semibold text-gray-900">Rekening Bank</h2>
        <p className="mt-1 text-sm/6 text-gray-500">
          Informasi lengkap mengenai rekening bank milik klien yang tercatat, digunakan untuk keperluan pembayaran,
          penagihan, dan pelacakan transaksi usaha Anda
        </p>
      </div>
      <div className="flex-1">
        <BankAccountProvider receiverId={id}>
          <BankAccountImpl />
        </BankAccountProvider>
      </div>
    </div>
  );
}
