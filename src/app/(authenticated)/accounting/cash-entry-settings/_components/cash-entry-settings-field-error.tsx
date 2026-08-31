type CashEntrySettingsFieldErrorProps = {
  message: string | null;
};

/** A save error placed beside this picker — renders nothing when the 422 belongs elsewhere. */
export function CashEntrySettingsFieldError({ message }: CashEntrySettingsFieldErrorProps) {
  if (message === null) return null;

  return (
    <p role="alert" className="text-xs leading-4 font-normal text-red-500">
      {message}
    </p>
  );
}
