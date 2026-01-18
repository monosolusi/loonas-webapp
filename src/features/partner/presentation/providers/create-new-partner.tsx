"use client";

import React, { useContext, useMemo } from "react";
import {
  CreateNewPartnerContextProps,
  CreateNewPartnerProviderProps,
} from "@/features/partner/presentation/providers/create-new-partner.types";
import { useCreatePartner } from "@/features/partner/presentation/hooks/use-create-partner";
import { isNonEmptyString, isValidEmail, isValidPhoneNumber } from "@/core/utilities/validation-patterns";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";

const CreateNewPartnerContext = React.createContext<CreateNewPartnerContextProps>({
  name: "",
  email: "",
  phone: "",
  loading: false,
});

export function CreateNewPartnerProvider(props: CreateNewPartnerProviderProps) {
  const [name, setName] = React.useState<string>("");
  const [email, setEmail] = React.useState<string>("");
  const [phone, setPhone] = React.useState<string>("");
  const { trigger, isMutating } = useCreatePartner();

  const isClean = useMemo(() => {
    return isNonEmptyString(name) && isValidEmail(email) && isValidPhoneNumber(phone);
  }, [name, email, phone]);

  const clearInput = React.useCallback(() => {
    setName("");
    setEmail("");
    setPhone("");
  }, []);

  async function createPartner() {
    if (!isClean) throw new ServerError(ErrorCodes.INCOMPLETE_FORM);

    await trigger({ name, email, phoneNumber: phone });
    clearInput();
  }

  return (
    <CreateNewPartnerContext.Provider
      value={{
        name,
        email,
        phone,
        loading: isMutating,
        setName,
        setEmail,
        setPhone,
        create: createPartner,
      }}
    >
      {props.children}
    </CreateNewPartnerContext.Provider>
  );
}

export function useCreateNewPartner() {
  const context = useContext(CreateNewPartnerContext);
  if (!context) throw new ServerError(ErrorCodes.INVALID_HOOK_CALL);
  return context;
}
