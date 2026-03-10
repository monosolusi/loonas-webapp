import { IDRFormatter } from "@/core/utilities/currency/domain/formatters/idr-formatter";
import { DateTime } from "luxon";

interface PaymentReceiptDocument {
  invoiceNumber?: string;
  invoiceDate: DateTime;
  dueDate: DateTime;
  amount: number;
}

interface PaymentReceiptPreviewProps {
  id: string;
  payer: { name: string; address: string };
  supplier: { name: string; email: string; phone: string };
  supplierBank: { accountNumber: string; accountHolderName: string; bankName: string };
  netAmount: number;
  paidAt: DateTime;
  documents: PaymentReceiptDocument[];
}

export function PaymentReceiptPreview({
  id,
  payer,
  supplier,
  supplierBank,
  netAmount,
  paidAt,
  documents,
}: PaymentReceiptPreviewProps) {
  return (
    <div className="mx-auto flex w-[210mm] flex-col bg-white px-16 py-12 text-sm text-neutral-500">
      {/* Header */}
      <div className="border-b-2 border-neutral-500 pb-4">
        <h1 className="text-2xl font-bold tracking-tight text-neutral-500">Bukti Pembayaran</h1>
      </div>

      {/* Success Banner */}
      <div className="mt-6 rounded-lg border border-success-200 bg-success-50 px-5 py-4">
        <div className="text-base font-semibold text-success-500">Pembayaran Berhasil</div>
        <div className="mt-1 flex flex-col gap-y-0.5 text-xs text-success-400">
          <span>{paidAt.toFormat("dd LLLL yyyy, HH:mm", { locale: "id" })} WIB</span>
          <span>ID Transaksi: {id}</span>
        </div>
      </div>

      {/* Parties */}
      <div className="mt-8 grid grid-cols-2 gap-x-8">
        {/* Payer */}
        <div className="flex flex-col gap-y-2 rounded-lg border border-neutral-100 p-4">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-neutral-200">Dari (Pembayar)</span>
          <div className="flex flex-col gap-y-0.5">
            <span className="text-sm font-semibold">{payer.name}</span>
            <span className="text-xs leading-4 text-neutral-300">{payer.address}</span>
          </div>
        </div>

        {/* Supplier */}
        <div className="flex flex-col gap-y-2 rounded-lg border border-neutral-100 p-4">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-neutral-200">
            Kepada (Penerima)
          </span>
          <div className="flex flex-col gap-y-0.5">
            <span className="text-sm font-semibold">{supplier.name}</span>
            <span className="text-xs text-neutral-300">{supplier.email}</span>
            <span className="text-xs text-neutral-300">{supplier.phone}</span>
          </div>
        </div>
      </div>

      {/* Supplier Bank */}
      <div className="mt-4 rounded-lg border border-neutral-100 p-4">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-neutral-200">Rekening Tujuan</span>
        <div className="mt-2 flex flex-col gap-y-0.5">
          <span className="text-sm font-semibold">{supplierBank.bankName}</span>
          <span className="text-xs text-neutral-300">
            {supplierBank.accountNumber} &bull; {supplierBank.accountHolderName}
          </span>
        </div>
      </div>

      {/* Documents Table */}
      {documents.length > 0 && (
        <div className="mt-8 flex flex-col">
          <span className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-neutral-200">
            Referensi Faktur
          </span>
          <div className="overflow-hidden rounded-lg border border-neutral-100">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-neutral-50">
                  <th className="px-4 py-2.5 font-medium text-neutral-300">No. Faktur</th>
                  <th className="px-4 py-2.5 font-medium text-neutral-300">Tanggal Faktur</th>
                  <th className="px-4 py-2.5 font-medium text-neutral-300">Jatuh Tempo</th>
                  <th className="px-4 py-2.5 text-right font-medium text-neutral-300">Jumlah</th>
                </tr>
              </thead>
              <tbody>
                {documents.map((doc, index) => (
                  <tr key={index} className="border-t border-neutral-100">
                    <td className="px-4 py-2.5">{doc.invoiceNumber ?? "-"}</td>
                    <td className="px-4 py-2.5">{doc.invoiceDate.toFormat("dd LLLL yyyy", { locale: "id" })}</td>
                    <td className="px-4 py-2.5">{doc.dueDate.toFormat("dd LLLL yyyy", { locale: "id" })}</td>
                    <td className="px-4 py-2.5 text-right">{IDRFormatter.toCurrency(doc.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Total */}
      <div className="mt-8 rounded-lg border-2 border-neutral-500 px-6 py-5">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-neutral-300">Total Diterima</span>
          <span className="text-2xl font-bold tracking-tight">{IDRFormatter.toCurrency(netAmount)}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-12 flex flex-col items-center gap-y-1 border-t border-dashed border-neutral-200 pt-6 text-center text-[11px] text-neutral-200">
        <span>Dokumen ini dibuat secara otomatis dan sah tanpa tanda tangan.</span>
        <span>
          Dicetak pada {DateTime.now().toFormat("dd LLLL yyyy, HH:mm", { locale: "id" })} WIB melalui loonas.id
        </span>
      </div>
    </div>
  );
}
