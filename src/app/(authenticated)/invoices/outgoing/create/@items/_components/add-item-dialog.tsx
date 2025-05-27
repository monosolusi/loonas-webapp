import {
  DiscountType,
  TaxType
} from "@/app/(authenticated)/invoices/outgoing/create/_providers/create-outgoing-invoice";
import React, { useState } from "react";
import { ServerError } from "@/core/resources/server-error";
import { LoonasDialog } from "@/core/presentations/components/loonas-dialog";
import { TextInput } from "@/core/presentations/components/text-input";
import { OutlinedButton } from "@/core/presentations/components/outlined-button";
import { FilledButton } from "@/core/presentations/components/filled-button";
import { TextArea } from "@/core/presentations/components/text-area";
import { TextInputWithLeftAddOn } from "@/core/presentations/components/text-input-with-left-add-on";
import { TextInputWithRightAddOn } from "@/core/presentations/components/text-input-with-right-add-on";
import { SelectInput } from "@/core/presentations/components/select-input";

interface ItemDetail {
  name: string;
  description?: string;
  qty: number;
  price: number;
  taxType: TaxType;
  tax: number;
  discountType?: DiscountType;
  discount?: number;
};

interface AddItemDialogProps {
  open: boolean;
  onClose?: () => void;
  onSubmit?: (item: ItemDetail) => void | Promise<void>;
}

export function AddItemDialog(props: AddItemDialogProps) {
  const [error, setError] = useState<ServerError>();

  const clearInput = () => {

  };

  const handleClose = () => {
    props.onClose?.();
  };

  return (
    <LoonasDialog
      title="Tambah Item"
      width="lg"
      open={props.open}
      onClose={handleClose}
    >
      <div>
        <p className="text-sm text-gray-500">
          Yuk, isi detail barang yang mau kamu cantumkan di faktur.
        </p>
        <div className="flex flex-col space-y-4 my-4">
          <TextInput title="Nama" />
          <TextArea title="Deskripsi" rows={2} />
          <div className="flex flex-row space-x-2">
            <div className="flex-1">
              <TextInput title="Jumlah" type="text" inputTextAlign="text-right" />
            </div>
            <div className="flex-2">
              <TextInputWithLeftAddOn title="Harga" leftAddOn="Rp" textDirection="text-right" />
            </div>
            <div className="flex-2">
              <TextInputWithLeftAddOn
                title="Jumlah"
                leftAddOn="Rp"
                value="100.000"
                textDirection="text-right"
                disabled
              />
            </div>
          </div>
          <div className="flex flex-row space-x-2">
            <div className="flex-1">
              <SelectInput
                title="Jenis Diskon"
                value=""
                data={[
                  { value: "", label: "Pilih Jenis Diskon" },
                  { value: DiscountType.PERCENTAGE, label: "Persentase" },
                  { value: DiscountType.FIXED, label: "Fixed" },
                  { value: DiscountType.NO_DISCOUNT, label: "Tidak Ada Diskon" }
                ]}
                disableFirstOption
              />
            </div>
            <div className="flex-1">
              <TextInputWithRightAddOn title="Diskon" rightAddOn="%" textDirection="text-right" />
            </div>
          </div>
          <div className="flex-1">
            <SelectInput
              title="Jenis Pajak"
              value=""
              data={[
                { value: "", label: "Pilih Jenis Pajak" },
                { value: TaxType.INCLUSIVE, label: "Inklusif" },
                { value: TaxType.EXCLUSIVE, label: "Eksklusif" },
                { value: TaxType.NON_TAXABLE, label: "Tidak Kena Pajak" }
              ]}
              disableFirstOption
            />
          </div>
          <div className="flex flex-row space-x-2">
            <div className="flex-1">
              <TextInputWithLeftAddOn title="Pajak" leftAddOn="Rp" textDirection="text-right" />
            </div>
            <div className="flex-1">
              <TextInputWithLeftAddOn
                title="DPP"
                leftAddOn="Rp"
                value="100.000"
                textDirection="text-right"
                disabled
              />
            </div>
          </div>
          <TextInputWithLeftAddOn title="Total" leftAddOn="Rp" textDirection="text-right" disabled />
        </div>
        <div className="flex flex-row space-x-4 pt-4 px-4 justify-end border-t border-gray-200 -mx-4 sm:-mx-6 sm:px-6">
          <OutlinedButton>
            Batal
          </OutlinedButton>
          <FilledButton>
            Simpan Item
          </FilledButton>
        </div>
      </div>
    </LoonasDialog>
  );
}
