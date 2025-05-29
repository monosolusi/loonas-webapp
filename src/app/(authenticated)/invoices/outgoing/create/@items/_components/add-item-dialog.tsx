import React, { useMemo, useState } from "react";
import { DiscountType } from "@/app/(authenticated)/invoices/outgoing/create/_providers/create-outgoing-invoice";
import { ServerError } from "@/core/resources/server-error";
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
import { TaxCalculator } from "@/core/utilities/tax/domain/calculator";
import { CalculateTaxButton } from "@/app/(authenticated)/invoices/outgoing/create/@items/_components/calculate-tax-button";
import { AddItemProvider } from "@/app/(authenticated)/invoices/outgoing/create/@items/_providers/add-item";
import { NameInput } from "@/app/(authenticated)/invoices/outgoing/create/@items/_components/name-input";
import { DescriptionInput } from "@/app/(authenticated)/invoices/outgoing/create/@items/_components/description-input";
import { SaveItemButton } from "@/app/(authenticated)/invoices/outgoing/create/@items/_components/save-item-button";

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
  const [amountAfterTax, setAmountAfterTax] = useState<number>(0);
  const [taxHasCalculated, setTaxHasCalculated] = useState<boolean>(false);
  const [error, setError] = useState<ServerError>();

  const submitDisabled = useMemo(() => {
    if (!name) return true;
    if (!qty) return true;
    if (price === undefined || price === null) return true;
    if (taxType !== TaxType.NON_TAXABLE && (!tax || !taxBase)) return true;
    if (discountType !== DiscountType.NO_DISCOUNT && !discount) return true;
    if (!taxHasCalculated) return true;
    return false;
  }, [name, description, qty, price, tax, taxBase, taxType, discount, discountType]);

  const amountBeforeTax: number = useMemo(() => {
    return TaxCalculator.calculateAmountBeforeTax({ qty, price, discount, discountType });
  }, [qty, price, discount, discountType]);

  const mustRecalculateTax = () => setTaxHasCalculated(false);

  const handleQtyChange = (value: number) => {
    setQty(value);
    mustRecalculateTax();
  };

  const handlePriceChange = (value: number) => {
    setPrice(value);
    mustRecalculateTax();
  };

  const handleTaxCalculated = (item: { tax: number; taxBase: number; amountAfterTax: number }) => {
    setTax(item.tax);
    setTaxBase(item.taxBase);
    setAmountAfterTax(item.amountAfterTax);
  };

  const handleDiscountTypeChange = (type: DiscountType) => {
    setDiscountType(type);
    if (type === DiscountType.NO_DISCOUNT) setDiscount(0);
    mustRecalculateTax();
  };

  const handleDiscountChange = (value: number) => {
    setDiscount(value);
    mustRecalculateTax();
  };

  const handleTaxTypeChange = (type: TaxType) => {
    setTaxType(type);
    if (type === TaxType.NON_TAXABLE) setTax(0);
    mustRecalculateTax();
  };

  const handleTaxChange = (value: number) => {
    setTax(value);
    mustRecalculateTax();
  };

  const handleTaxBaseChange = (value: number) => {
    setTaxBase(value);
    mustRecalculateTax();
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
    <AddItemProvider>
      <LoonasDialog title="Tambah Item" width="lg" open={props.open} onClose={handleClose}>
        <form onSubmit={handleSubmit}>
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
        </form>
      </LoonasDialog>
    </AddItemProvider>
  );
}
