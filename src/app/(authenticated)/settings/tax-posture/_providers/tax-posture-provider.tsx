"use client";

import { createContext, useContext, useState, useMemo, useCallback } from "react";
import { DateTime } from "luxon";
import { ErrorCodes } from "@/core/resources/server-error";
import { revalidateSWRKey } from "@/core/helpers/revalidate-swr-key";
import { useToast } from "@/core/presentations/hooks/use-toast";
import { LegalForm } from "@/features/accounting/domain/enums/legal-form";
import { AccountSettingEntity } from "@/features/accounting/domain/entities/account-setting";
import { useGetAccountSetting } from "@/features/accounting/presentations/hooks/use-get-account-setting";
import { useUpdateAccountSetting } from "@/features/accounting/presentations/hooks/use-update-account-setting";
import { UpdateAccountSettingInput } from "@/features/accounting/domain/usecases/update-account-setting.usecases";
import { ACCOUNTING_SWR_KEYS } from "@/features/accounting/presentations/constants/swr-keys";

export type TaxPostureFormValues = {
  legalForm: LegalForm;
  npwp: string;
  nppkp: string;
  pkpEffectiveDate: string;
  isPphFinalUmkm: boolean;
  pphFinalEligibilityStart: string;
  sektorKlbi: string;
};

export type TaxPostureFormErrors = {
  npwp: string | null;
  nppkp: string | null;
  pkpEffectiveDate: string | null;
  pphFinalEligibilityStart: string | null;
};

type TaxPostureContextValue = {
  setting: AccountSettingEntity;
  formValues: TaxPostureFormValues;
  formErrors: TaxPostureFormErrors;
  isDirty: boolean;
  isValid: boolean;
  isSaving: boolean;
  setFormValue: <K extends keyof TaxPostureFormValues>(key: K, value: TaxPostureFormValues[K]) => void;
  validateField: (field: keyof TaxPostureFormErrors) => void;
  handleReset: () => void;
  handleSubmit: () => Promise<void>;
};

const TaxPostureContext = createContext<TaxPostureContextValue | null>(null);

export function useTaxPosture() {
  const context = useContext(TaxPostureContext);
  if (!context) throw new Error("useTaxPosture must be used within TaxPostureProvider");
  return context;
}

function buildFormDefaults(setting: AccountSettingEntity): TaxPostureFormValues {
  return {
    legalForm: setting.legalForm,
    npwp: setting.npwp ?? "",
    nppkp: setting.nppkp ?? "",
    pkpEffectiveDate: setting.pkpEffectiveDate
      ? DateTime.fromJSDate(setting.pkpEffectiveDate).toISODate() ?? ""
      : "",
    isPphFinalUmkm: setting.isPphFinalUmkm,
    pphFinalEligibilityStart: setting.pphFinalEligibilityStart
      ? DateTime.fromJSDate(setting.pphFinalEligibilityStart).toISODate() ?? ""
      : "",
    sektorKlbi: setting.sektorKlbi ?? "",
  };
}

function validateNpwp(value: string): string | null {
  if (!value) return null;
  const digits = value.replace(/\D/g, "");
  if (digits.length !== 15 && digits.length !== 16) {
    return "NPWP harus terdiri dari 15 atau 16 digit angka.";
  }
  return null;
}

function validateNppkp(value: string): string | null {
  if (value.length > 30) return "NPPKP tidak boleh melebihi 30 karakter.";
  return null;
}

function validateDate(value: string): string | null {
  if (!value) return null;
  const dt = DateTime.fromISO(value);
  if (!dt.isValid) return "Tanggal tidak valid.";
  return null;
}

type TaxPostureProviderProps = {
  loading: React.ReactNode;
  accessDenied: React.ReactNode;
  children: React.ReactNode;
};

export function TaxPostureProvider({ loading: loadingIndicator, accessDenied, children }: TaxPostureProviderProps) {
  const getResult = useGetAccountSetting();
  const { trigger, isMutating } = useUpdateAccountSetting();
  const { showToast } = useToast();

  const [formValuesOverride, setFormValuesOverride] = useState<TaxPostureFormValues | null>(null);
  const [formErrors, setFormErrors] = useState<TaxPostureFormErrors>({
    npwp: null,
    nppkp: null,
    pkpEffectiveDate: null,
    pphFinalEligibilityStart: null,
  });

  const setting = getResult.loading ? null : getResult.data;

  // Derive form values: use override if set, otherwise derive from loaded setting
  const currentFormValues = useMemo<TaxPostureFormValues | null>(() => {
    if (formValuesOverride !== null) return formValuesOverride;
    if (setting) return buildFormDefaults(setting);
    return null;
  }, [formValuesOverride, setting]);

  const setFormValue = useCallback(<K extends keyof TaxPostureFormValues>(key: K, value: TaxPostureFormValues[K]) => {
    setFormValuesOverride((prev) => {
      const base = prev ?? (setting ? buildFormDefaults(setting) : null);
      if (!base) return prev;
      return { ...base, [key]: value };
    });
  }, [setting]);

  const validateField = useCallback((field: keyof TaxPostureFormErrors) => {
    if (!currentFormValues) return;
    setFormErrors((prev) => {
      switch (field) {
        case "npwp":
          return { ...prev, npwp: validateNpwp(currentFormValues.npwp) };
        case "nppkp":
          return { ...prev, nppkp: validateNppkp(currentFormValues.nppkp) };
        case "pkpEffectiveDate":
          return { ...prev, pkpEffectiveDate: validateDate(currentFormValues.pkpEffectiveDate) };
        case "pphFinalEligibilityStart":
          return { ...prev, pphFinalEligibilityStart: validateDate(currentFormValues.pphFinalEligibilityStart) };
        default:
          return prev;
      }
    });
  }, [currentFormValues]);

  const savedValues = useMemo<TaxPostureFormValues | null>(
    () => (setting ? buildFormDefaults(setting) : null),
    [setting],
  );

  const dirtyPayload = useMemo<UpdateAccountSettingInput>(() => {
    if (!currentFormValues || !savedValues) return {};
    const payload: UpdateAccountSettingInput = {};
    if (currentFormValues.legalForm !== savedValues.legalForm) payload.legalForm = currentFormValues.legalForm;
    if (currentFormValues.npwp !== savedValues.npwp) {
      const digits = currentFormValues.npwp.replace(/\D/g, "");
      payload.npwp = digits || null;
    }
    if (currentFormValues.nppkp !== savedValues.nppkp) {
      payload.nppkp = currentFormValues.nppkp || null;
    }
    if (currentFormValues.pkpEffectiveDate !== savedValues.pkpEffectiveDate) {
      payload.pkpEffectiveDate = currentFormValues.pkpEffectiveDate || null;
    }
    if (currentFormValues.isPphFinalUmkm !== savedValues.isPphFinalUmkm) {
      payload.isPphFinalUmkm = currentFormValues.isPphFinalUmkm;
    }
    if (currentFormValues.pphFinalEligibilityStart !== savedValues.pphFinalEligibilityStart) {
      payload.pphFinalEligibilityStart = currentFormValues.pphFinalEligibilityStart || null;
    }
    if (currentFormValues.sektorKlbi !== savedValues.sektorKlbi) {
      payload.sektorKlbi = currentFormValues.sektorKlbi || null;
    }
    return payload;
  }, [currentFormValues, savedValues]);

  const isDirty = useMemo(() => Object.keys(dirtyPayload).length > 0, [dirtyPayload]);

  const isValid = useMemo(() => {
    if (!currentFormValues) return false;
    return (
      validateNpwp(currentFormValues.npwp) === null &&
      validateNppkp(currentFormValues.nppkp) === null &&
      validateDate(currentFormValues.pkpEffectiveDate) === null &&
      validateDate(currentFormValues.pphFinalEligibilityStart) === null
    );
  }, [currentFormValues]);

  const handleReset = useCallback(() => {
    if (!setting) return;
    setFormValuesOverride(null); // clears override → re-derives from saved setting
    setFormErrors({ npwp: null, nppkp: null, pkpEffectiveDate: null, pphFinalEligibilityStart: null });
  }, [setting]);

  const handleSubmit = useCallback(async () => {
    if (!isDirty || !isValid || isMutating) return;
    try {
      await trigger(dirtyPayload);
      await revalidateSWRKey(ACCOUNTING_SWR_KEYS.GET_ACCOUNT_SETTING, ACCOUNTING_SWR_KEYS.LIST_ACCOUNT_SETTING_AUDIT);
      setFormValuesOverride(null); // re-derive from refreshed setting
      showToast("Postur pajak berhasil disimpan.", "success");
    } catch {
      showToast("Gagal menyimpan postur pajak. Silakan coba lagi.", "error");
    }
  }, [isDirty, isValid, isMutating, trigger, dirtyPayload, showToast]);

  // Access denied (403): render the access denied component in place of both cards
  const isLoading = getResult.loading;
  const error = !isLoading ? getResult.error : null;

  if (!isLoading && error) {
    if (error.code === ErrorCodes.FORBIDDEN.code) {
      return <>{accessDenied}</>;
    }
    // Other errors fall through to the loading indicator — page can evolve to handle these
    return <>{loadingIndicator}</>;
  }

  // Still loading or setting not yet available
  if (isLoading || !setting || !currentFormValues) {
    return <>{loadingIndicator}</>;
  }

  return (
    <TaxPostureContext.Provider
      value={{
        setting,
        formValues: currentFormValues,
        formErrors,
        isDirty,
        isValid,
        isSaving: isMutating,
        setFormValue,
        validateField,
        handleReset,
        handleSubmit,
      }}
    >
      {children}
    </TaxPostureContext.Provider>
  );
}
