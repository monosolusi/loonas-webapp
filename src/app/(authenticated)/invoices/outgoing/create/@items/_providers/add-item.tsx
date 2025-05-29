"use client";

import React, { useEffect, useState } from "react";
import { TaxType } from "@/features/tax/domain/enums/tax-type";
import { DiscountType } from "@/app/(authenticated)/invoices/outgoing/create/_providers/create-outgoing-invoice";

interface AddItemProviderProps {
  children: React.ReactNode;
}

interface AddItemContextProps {
  name: string;
  description: string;
  qty: number;
  price: number;
  discountType: DiscountType;
  discount: number;
  taxType: TaxType;
  tax: number;
  taxBase: number;
  total: number;
  mustRecalculateTax: boolean;
  recalculated?: () => void;
  setName?: React.Dispatch<React.SetStateAction<string>>;
  setDescription?: React.Dispatch<React.SetStateAction<string>>;
  setQty?: React.Dispatch<React.SetStateAction<number>>;
  setPrice?: React.Dispatch<React.SetStateAction<number>>;
  setDiscountType?: React.Dispatch<React.SetStateAction<DiscountType>>;
  setDiscount?: React.Dispatch<React.SetStateAction<number>>;
  setTaxType?: React.Dispatch<React.SetStateAction<TaxType>>;
  setTax?: React.Dispatch<React.SetStateAction<number>>;
  setTaxBase?: React.Dispatch<React.SetStateAction<number>>;
  setTotal?: React.Dispatch<React.SetStateAction<number>>;
}

const AddItemContext = React.createContext<AddItemContextProps>({
  name: "",
  description: "",
  qty: 0,
  price: 0,
  discountType: DiscountType.NO_DISCOUNT,
  discount: 0,
  taxType: TaxType.NON_TAXABLE,
  tax: 0,
  taxBase: 0,
  total: 0,
  mustRecalculateTax: true,
});

export function AddItemProvider(props: AddItemProviderProps) {
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [qty, setQty] = useState<number>(1);
  const [price, setPrice] = useState<number>(0);
  const [discountType, setDiscountType] = useState<DiscountType>(DiscountType.NO_DISCOUNT);
  const [discount, setDiscount] = useState<number>(0);
  const [taxType, setTaxType] = useState<TaxType>(TaxType.NON_TAXABLE);
  const [tax, setTax] = useState<number>(0);
  const [taxBase, setTaxBase] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);

  // Utility States
  const [mustRecalculateTax, setMustRecalculateTax] = useState<boolean>(true);

  // Functions
  const recalculated = () => setMustRecalculateTax(false);

  useEffect(() => {
    if (taxType === TaxType.NON_TAXABLE) setMustRecalculateTax(false);
    else setMustRecalculateTax(true);
  }, [qty, price, taxType, discount, discountType, tax, taxBase]);

  return (
    <AddItemContext.Provider
      value={{
        name,
        description,
        qty,
        price,
        discountType,
        discount,
        taxType,
        tax,
        taxBase,
        total,
        mustRecalculateTax,
        recalculated,
        setName,
        setDescription,
        setQty,
        setPrice,
        setDiscountType,
        setDiscount,
        setTaxType,
        setTax,
        setTaxBase,
        setTotal,
      }}
    >
      {props.children}
    </AddItemContext.Provider>
  );
}

export function useAddItem() {
  return React.useContext(AddItemContext);
}
