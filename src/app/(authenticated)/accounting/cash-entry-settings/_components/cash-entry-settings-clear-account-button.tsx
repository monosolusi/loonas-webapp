import { SecondaryButton } from "@/core/presentations/components/buttons/secondary-button";

type CashEntrySettingsClearAccountButtonProps = {
  /** Offered whenever the field holds anything — a chosen account or a stale saved id. */
  canClear: boolean;
  onClear: () => void;
};

/** The remedy for both a wrong default and a stale one: clear the field so the save unblocks. */
export function CashEntrySettingsClearAccountButton({ canClear, onClear }: CashEntrySettingsClearAccountButtonProps) {
  if (!canClear) return null;

  return (
    <SecondaryButton
      outlined
      type="button"
      label="Kosongkan"
      onClick={onClear}
      className="w-auto self-start px-4"
    />
  );
}
