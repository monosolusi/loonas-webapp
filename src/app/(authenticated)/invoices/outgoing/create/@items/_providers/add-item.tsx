"use client";

import React, { useEffect, useRef, useState } from "react";
import { TaxType } from "@/features/tax/domain/enums/tax-type";
import { TaxCalculator } from "@/core/utilities/tax/domain/calculator";
import { DiscountType } from "@/features/invoice/domain/enums/discount-type";

type InitialItem = {
  name: string;
  description?: string;
  qty: number;
  price: number;
  discountType: DiscountType;
  discount: number;
  taxType: TaxType;
  tax: number;
  taxBase: number;
  total: number;
};

interface AddItemProviderProps {
  children: React.ReactNode;
  initialValue?: InitialItem;
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
  setCalculatedTax?: (result: { tax: number; taxBase: number; total: number }) => void;
  clearInput?: () => void;
  setInput?: (data: InitialItem) => void;
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
  const [name, setName] = useState<string>(props.initialValue?.name ?? "");
  const [description, setDescription] = useState<string>(props.initialValue?.description ?? "");
  const [qty, setQty] = useState<number>(props.initialValue?.qty ?? 1);
  const [price, setPrice] = useState<number>(props.initialValue?.price ?? 0);
  const [discountType, setDiscountType] = useState<DiscountType>(
    props.initialValue?.discountType ?? DiscountType.NO_DISCOUNT,
  );
  const [discount, setDiscount] = useState<number>(props.initialValue?.discount ?? 0);
  const [taxType, setTaxType] = useState<TaxType>(props.initialValue?.taxType ?? TaxType.NON_TAXABLE);
  const [tax, setTax] = useState<number>(props.initialValue?.tax ?? 0);
  const [taxBase, setTaxBase] = useState<number>(props.initialValue?.taxBase ?? 0);
  const [total, setTotal] = useState<number>(props.initialValue?.total ?? 0);

  // Utility States
  const [mustRecalculateTax, setMustRecalculateTax] = useState<boolean>(true);
  const isCalculatingRef = useRef(false);

  // Functions
  const recalculated = () => setMustRecalculateTax(false);

  const setCalculatedTax = (result: { tax: number; taxBase: number; total: number }) => {
    isCalculatingRef.current = true;
    setTax(result.tax);
    setTaxBase(result.taxBase);
    setTotal(result.total);
    setMustRecalculateTax(false);
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
    setTaxBase(0);
    setTotal(0);
    setMustRecalculateTax(true);
  };

  const setInput = (data: InitialItem) => {
    isCalculatingRef.current = true;
    setName(data.name);
    setDescription(data.description ?? "");
    setQty(data.qty);
    setPrice(data.price);
    setDiscountType(data.discountType);
    setDiscount(data.discount);
    setTaxType(data.taxType);
    setTax(data.tax);
    setTaxBase(data.taxBase);
    setTotal(data.total);
    setMustRecalculateTax(false);
  };

  useEffect(() => {
    if (isCalculatingRef.current) return;
    if (taxType === TaxType.NON_TAXABLE) setMustRecalculateTax(false);
    else setMustRecalculateTax(true);
  }, [qty, price, taxType, discount, discountType, tax, taxBase]);

  // Always reset the calculating flag after each render so it never stays stale
  useEffect(() => {
    isCalculatingRef.current = false;
  });

  useEffect(() => {
    if (taxType === TaxType.NON_TAXABLE) {
      const total = TaxCalculator.calculateAmountBeforeTax({
        price: price,
        qty: qty,
        discountType: discountType,
        discount: discount,
      });

      setTotal(total);
    }
  }, [taxType, qty, price, discountType, discount]);

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
        setCalculatedTax,
        clearInput,
        setInput,
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
