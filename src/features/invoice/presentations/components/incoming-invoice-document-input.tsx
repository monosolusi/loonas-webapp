import Image from "next/image";
import { CurrencyInput } from "@/core/presentations/components/text-inputs/currency-input";
import { TextInput } from "@/core/presentations/components/text-inputs/text-input";
import { DatePickerInput } from "@/core/presentations/components/text-inputs/date-picker-input";
import { FileUploadInput } from "@/core/presentations/components/file-upload-input";
import { IncomingInvoiceDocumentInputProps } from "@/features/invoice/presentations/components/incoming-invoice-document-input.types";
import { DateTime } from "luxon";

export function IncomingInvoiceDocumentInput(props: IncomingInvoiceDocumentInputProps) {
  const onAmountChange = (value: number) => {
    if (!props.onChange) return;
    props.onChange(Object.assign({}, props.invoice, { amount: value }));
  };

  const onInvoiceNumberChange = (value: string) => {
    if (!props.onChange) return;
    props.onChange(Object.assign({}, props.invoice, { invoiceNumber: value }));
  };

  const onInvoiceDateChange = (value?: DateTime) => {
    if (!props.onChange) return;
    props.onChange(Object.assign({}, props.invoice, { invoiceDate: value }));
  };

  const onDueDateChange = (value?: DateTime) => {
    if (!props.onChange) return;
    props.onChange(Object.assign({}, props.invoice, { dueDate: value }));
  };

  const onNoteChange = (value: string) => {
    if (!props.onChange) return;
    props.onChange(Object.assign({}, props.invoice, { note: value }));
  };

  const onFileChange = (file: File | null) => {
    if (!props.onChange) return;
    props.onChange(Object.assign({}, props.invoice, { file }));
  };

  return (
    <div className="relative flex flex-col gap-y-5 rounded-lg border border-neutral-200 bg-white p-6">
      {/* Number & Delete Icon */}
      <div className="absolute top-4 right-4 flex flex-row items-center gap-x-2">
        <div className="flex flex-col items-center justify-center rounded-sm bg-neutral-200 px-2 py-1">
          <div className="text-xs leading-4 font-bold text-neutral-300">#{props.index + 1}</div>
        </div>

        {/* Delete Button */}
        {props.showDelete && (
          <div className="flex size-8 cursor-pointer flex-col items-center justify-center" onClick={props.onDelete}>
            <Image src="/assets/images/trash-icon-neutral-400-w16-h16.svg" alt="delete item" width={16} height={16} />
          </div>
        )}
      </div>

      {/*  Invoice Value */}
      <CurrencyInput value={props.invoice.amount} onChange={onAmountChange} />

      <div className="flex flex-col gap-y-5">
        <TextInput
          label="Nomor Faktur"
          type="text"
          placeholder="INV-001/..."
          leftIcon={
            <Image
              src="/assets/images/hashtag-icon-neutral-400-w16-h16.svg"
              alt="hashtag icon"
              width={16}
              height={16}
            />
          }
          value={props.invoice.invoiceNumber}
          onChange={onInvoiceNumberChange}
          required
        />

        <div className="flex flex-row gap-x-5">
          <div className="flex-1">
            <DatePickerInput
              label="Tanggal Faktur"
              value={props.invoice.invoiceDate}
              onChange={onInvoiceDateChange}
              required
            />
          </div>
          <div className="flex-1">
            <DatePickerInput label="Tanggal Jatuh Tempo" value={props.invoice.dueDate} onChange={onDueDateChange} />
          </div>
        </div>

        <TextInput
          label="Keterangan"
          type="text"
          placeholder="Cth. Pembayaran DP 50%"
          leftIcon={
            <Image
              src="/assets/images/document-icon-neutral-400-w16-h16.svg"
              alt="document icon"
              width={16}
              height={16}
            />
          }
          value={props.invoice.note}
          onChange={onNoteChange}
        />
      </div>

      <FileUploadInput
        label="Bukti Dokumen"
        maxSize={1024 * 1024 * 5}
        value={props.invoice.file}
        onChange={onFileChange}
        required
      />
    </div>
  );
}
