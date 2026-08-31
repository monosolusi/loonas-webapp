import { CashEntrySettingsFeedbackMessage } from "@/app/(authenticated)/accounting/cash-entry-settings/_utils/resolve-settings-feedback";

type CashEntrySettingsFeedbackProps = {
  /** Resolved by `resolveSettingsFeedback` — at most one message can ever be current. */
  feedback: CashEntrySettingsFeedbackMessage | null;
};

/** The single message slot above the save button. */
export function CashEntrySettingsFeedback({ feedback }: CashEntrySettingsFeedbackProps) {
  if (feedback === null) return null;

  return (
    <p role={feedback.role} className={feedback.className}>
      {feedback.message}
    </p>
  );
}
