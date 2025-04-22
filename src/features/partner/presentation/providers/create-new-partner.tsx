"use client";

import React from "react";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { LocalStorageSessionService } from "@/features/authentication/data/sources/local-storage-session";
import { DataFailed } from "@/core/resources/data-state";
import { CreatePartnerUseCase, CreatePartnerUseCaseParams } from "@/features/partner/domain/usecases/create-partner";
import { PartnerRepositoryImpl } from "@/features/partner/data/repositories/partner";
import { PartnerServiceImpl } from "@/features/partner/data/sources/partner";

interface CreateNewPartnerContextProps {
  name: string;
  email: string;
  phone: string;
  loading: boolean;
  error?: Error;
  setName?: React.Dispatch<React.SetStateAction<string>>;
  setEmail?: React.Dispatch<React.SetStateAction<string>>;
  setPhone?: React.Dispatch<React.SetStateAction<string>>;
  createPartner?: () => Promise<boolean>;
  clearError?: () => void;
  clearInput?: () => void;
}

const CreateNewPartnerContext = React.createContext<CreateNewPartnerContextProps>({
  name: "",
  email: "",
  phone: "",
  loading: false
});

export function CreateNewPartnerProvider({ children }: { children: React.ReactNode }) {
  const [name, setName] = React.useState<string>("");
  const [email, setEmail] = React.useState<string>("");
  const [phone, setPhone] = React.useState<string>("");
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<Error>();

  const clearError = React.useCallback(() => {
    setError(undefined);
  }, []);

  const clearInput = React.useCallback(() => {
    setName("");
    setEmail("");
    setPhone("");
  }, []);

  async function createPartner() {
    try {
      setLoading(true);
      if (!name) throw new ServerError(ErrorCodes.EMPTY_NAME);
      if (!email) throw new ServerError(ErrorCodes.EMPTY_EMAIL);
      if (!phone) throw new ServerError(ErrorCodes.EMPTY_PHONE);

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) throw new ServerError(ErrorCodes.INVALID_EMAIL);

      const parsedPhoneNumber =
        parsePhoneNumberFromString(phone, { defaultCountry: "ID" }) ||
        parsePhoneNumberFromString(phone, { defaultCountry: "SG" });

      // If still not valid, throw an error
      if (!parsedPhoneNumber || !parsedPhoneNumber.isValid()) throw new ServerError(ErrorCodes.INVALID_PHONE_NUMBER);

      // The phone number is correct here, now it is time to insert the database
      const partnerService = new PartnerServiceImpl();
      const sessionService = new LocalStorageSessionService();
      const sessionRepository = new SessionRepositoryImpl(sessionService);
      const partnerRepository = new PartnerRepositoryImpl(partnerService);
      const createPartner = new CreatePartnerUseCase(partnerRepository, sessionRepository);
      const createPartnerParams = new CreatePartnerUseCaseParams(
        name,
        email,
        parsedPhoneNumber.number.toString()
      );

      const result = await createPartner.execute(createPartnerParams);
      if (result instanceof DataFailed) throw result.error;
      if (!result.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

      // Reset form after successful creation
      clearInput();
      setLoading(false);

      return true;
    } catch (err: any) {
      setLoading(false);
      setError(err);
      return false;
    }
  }

  return (
    <CreateNewPartnerContext.Provider
      value={{
        name,
        email,
        phone,
        loading,
        error,
        setName,
        setEmail,
        setPhone,
        createPartner,
        clearError,
        clearInput
      }}
    >
      {children}
    </CreateNewPartnerContext.Provider>
  );
}

export function useCreateNewPartner() {
  return React.useContext(CreateNewPartnerContext);
}