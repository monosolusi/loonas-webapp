type CashEntrySettingsMissingAccountNoticeProps = {
  /** Non-null when the saved default's id is absent from the ledger-account list. */
  savedId: string | null;
};

/**
 * The `missing` selection state's presentation. Rendering a saved default that cannot be shown as
 * an empty combobox would read as "no default configured", so it gets its own notice instead.
 */
export function CashEntrySettingsMissingAccountNotice({ savedId }: CashEntrySettingsMissingAccountNoticeProps) {
  if (savedId === null) return null;

  return (
    <p role="alert" className="text-xs leading-4 font-normal text-red-500">
      Akun default yang tersimpan tidak ditemukan di daftar akun.
    </p>
  );
}
