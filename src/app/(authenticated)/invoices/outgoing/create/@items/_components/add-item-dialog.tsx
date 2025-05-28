import React, { useMemo, useState } from "react";
import { DiscountType } from "@/app/(authenticated)/invoices/outgoing/create/_providers/create-outgoing-invoice";
import { ServerError } from "@/core/resources/server-error";
import { LoonasDialog } from "@/core/presentations/components/loonas-dialog";
import { TextInput } from "@/core/presentations/components/text-input";
import { OutlinedButton } from "@/core/presentations/components/outlined-button";
import { FilledButton } from "@/core/presentations/components/filled-button";
import { TextArea } from "@/core/presentations/components/text-area";
import { QtyInput } from "@/app/(authenticated)/invoices/outgoing/create/@items/_components/qty-input";
import { PriceInput } from "@/app/(authenticated)/invoices/outgoing/create/@items/_components/price-input";
import { TotalField } from "@/app/(authenticated)/invoices/outgoing/create/@items/_components/total-field";
import { DiscountTypeSelect } from "@/app/(authenticated)/invoices/outgoing/create/@items/_components/discount-type";
import { DiscountInput } from "@/app/(authenticated)/invoices/outgoing/create/@items/_components/discount-input";
import { TaxTypeSelect } from "@/app/(authenticated)/invoices/outgoing/create/@items/_components/tax-type";
import { TaxInput } from "@/app/(authenticated)/invoices/outgoing/create/@items/_components/tax-input";
import { TaxBaseField } from "@/app/(authenticated)/invoices/outgoing/create/@items/_components/tax-base-field";
import { TotalWithTaxField } from "@/app/(authenticated)/invoices/outgoing/create/@items/_components/total-with-tax-field";
import { TaxType } from "@/features/tax/domain/enums/tax-type";

export interface ItemDetail {
  name: string;
  description?: string;
  qty: number;
  price: number;
  taxType: TaxType;
  tax: number;
  discountType?: DiscountType;
  discount?: number;
}

interface AddItemDialogProps {
  open: boolean;
  onClose?: () => void;
  onSubmit?: (item: ItemDetail) => void | Promise<void>;
}

export function AddItemDialog(props: AddItemDialogProps) {
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [qty, setQty] = useState<number>(1);
  const [price, setPrice] = useState<number>(0);
  const [discountType, setDiscountType] = useState<DiscountType>(DiscountType.NO_DISCOUNT);
  const [discount, setDiscount] = useState<number>(0);
  const [taxType, setTaxType] = useState<TaxType>(TaxType.NON_TAXABLE);
  const [tax, setTax] = useState<number>(0);
  const [taxBase, setTaxBase] = useState<number>(0);
  const [error, setError] = useState<ServerError>();

  const submitDisabled = useMemo(() => {
    if (!name) return true;
    if (!qty) return true;
    if (!price) return true;
    if (taxType !== TaxType.NON_TAXABLE && (!tax || !taxBase)) return true;
    if (discountType !== DiscountType.NO_DISCOUNT && !discount) return true;
    return false;
  }, [name, description, qty, price, tax, taxBase, taxType, discount, discountType]);

  const handleDiscountTypeChange = (type: DiscountType) => {
    setDiscountType(type);
    if (type === DiscountType.NO_DISCOUNT) setDiscount(0);
  };

  const handleTaxTypeChange = (type: TaxType) => {
    setTaxType(type);
    if (type === TaxType.NON_TAXABLE) setTax(0);
  };

  const clearInput = () => {
    setName("");
    setDescription("");
    setQty(1);
    setPrice(0);
    setDiscountType(DiscountType.NO_DISCOUNT);
    setDiscount(0);
    setTaxType(TaxType.NON_TAXABLE);
    setTax(0);
  };

  const handleClose = () => {
    clearInput();
    props.onClose?.();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!props.onSubmit) return;
    if (!name) return;
    if (!qty) return;
    if (!price) return;

    await props.onSubmit({
      name: name,
      description: description,
      qty: qty,
      price: price,
      discountType: discountType,
      discount: discount,
      taxType: taxType,
      tax: tax,
    });

    clearInput();
  };

  return (
    <LoonasDialog title="Tambah Item" width="lg" open={props.open} onClose={handleClose}>
      <form onSubmit={handleSubmit}>
        <p className="text-sm text-gray-500">Yuk, isi detail barang yang mau kamu cantumkan di faktur.</p>
        <div className="my-4 flex flex-col space-y-4">
          <TextInput title="Nama" value={name} onChange={setName} required />
          <TextArea title="Deskripsi" value={description} onChange={setDescription} rows={2} />
          <div className="flex flex-row space-x-2">
            <div className="flex-1">
              <QtyInput value={qty} onChange={setQty} />
            </div>
            <div className="flex-2">
              <PriceInput value={price} onChange={setPrice} />
            </div>
            <div className="flex-2">
              <TotalField qty={qty} price={price} />
            </div>
          </div>
          <div className="flex flex-row space-x-2">
            <div className="flex-1">
              <DiscountTypeSelect value={discountType} onChange={handleDiscountTypeChange} />
            </div>
            <div className="flex-1">
              <DiscountInput type={discountType} value={discount} onChange={setDiscount} />
            </div>
          </div>
          <div className="flex-1">
            <TaxTypeSelect value={taxType} onChange={handleTaxTypeChange} />
          </div>
          <div className="flex flex-row space-x-2">
            <div className="flex-1">
              <TaxInput value={tax} onChange={setTax} taxType={taxType} />
            </div>
            <div className="flex-1">
              <TaxBaseField value={taxBase} onChange={setTaxBase} taxType={taxType} />
            </div>
          </div>
          <TotalWithTaxField
            price={price}
            qty={qty}
            discountType={discountType}
            discount={discount}
            taxType={taxType}
            tax={tax}
          />
        </div>
        <div className="-mx-4 flex flex-row justify-end space-x-4 border-t border-gray-200 px-4 pt-4 sm:-mx-6 sm:px-6">
          <OutlinedButton type="button" onClick={handleClose}>
            Batal
          </OutlinedButton>
          <FilledButton type="submit" disabled={submitDisabled}>
            Simpan Item
          </FilledButton>
        </div>
      </form>
    </LoonasDialog>
  );
}
