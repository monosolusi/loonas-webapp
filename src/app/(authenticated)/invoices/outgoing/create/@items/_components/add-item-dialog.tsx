import React from "react";
import { LoonasDialog } from "@/core/presentations/components/loonas-dialog";
import { OutlinedButton } from "@/core/presentations/components/outlined-button";
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
import { CalculateTaxButton } from "@/app/(authenticated)/invoices/outgoing/create/@items/_components/calculate-tax-button";
import { AddItemProvider } from "@/app/(authenticated)/invoices/outgoing/create/@items/_providers/add-item";
import { NameInput } from "@/app/(authenticated)/invoices/outgoing/create/@items/_components/name-input";
import { DescriptionInput } from "@/app/(authenticated)/invoices/outgoing/create/@items/_components/description-input";
import { SaveItemButton } from "@/app/(authenticated)/invoices/outgoing/create/@items/_components/save-item-button";
import { AddItemForm } from "@/app/(authenticated)/invoices/outgoing/create/@items/_components/add-item-form";
import { DiscountType } from "@/features/invoice/domain/enums/discount-type";

export interface ItemDetail {
  name: string;
  description?: string;
  qty: number;
  price: number;
  taxType: TaxType;
  tax: number;
  taxBase: number;
  discountType?: DiscountType;
  discount?: number;
  total: number;
}

interface AddItemDialogProps {
  open: boolean;
  onClose?: () => void;
  onSubmit?: (item: ItemDetail) => void | Promise<void>;
}

export function AddItemDialog(props: AddItemDialogProps) {
  const handleClose = () => {
    props.onClose?.();
  };

  return (
    <AddItemProvider>
      <LoonasDialog title="Tambah Item" width="lg" open={props.open} onClose={handleClose}>
        <AddItemForm onSubmit={props.onSubmit}>
          <p className="text-sm text-gray-500">Yuk, isi detail barang yang mau kamu cantumkan di faktur.</p>
          <div className="my-4 flex flex-col space-y-4">
            <NameInput />
            <DescriptionInput />
            <div className="flex flex-row space-x-2">
              <div className="flex-1">
                <QtyInput />
              </div>
              <div className="flex-2">
                <PriceInput />
              </div>
              <div className="flex-2">
                <TotalField />
              </div>
            </div>
            <div className="flex flex-row space-x-2">
              <div className="flex-1">
                <DiscountTypeSelect />
              </div>
              <div className="flex-1">
                <DiscountInput />
              </div>
            </div>
            <div className="flex-1">
              <TaxTypeSelect />
            </div>
            <div className="flex flex-row space-x-2">
              <div className="flex-1">
                <TaxInput />
              </div>
              <div className="flex-1">
                <TaxBaseField />
              </div>
            </div>
            <div className="flex flex-row items-end space-x-2">
              <div className="flex-2">
                <TotalWithTaxField />
              </div>
              <div className="flex-1">
                <CalculateTaxButton />
              </div>
            </div>
          </div>
          <div className="-mx-4 flex flex-row justify-end space-x-4 border-t border-gray-200 px-4 pt-4 sm:-mx-6 sm:px-6">
            <OutlinedButton type="button" onClick={handleClose}>
              Batal
            </OutlinedButton>
            <SaveItemButton />
          </div>
        </AddItemForm>
      </LoonasDialog>
    </AddItemProvider>
  );
}
