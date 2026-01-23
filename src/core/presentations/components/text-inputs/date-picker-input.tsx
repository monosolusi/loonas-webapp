import Image from "next/image";
import { DateTime } from "luxon";
import { TextInput, TextInputProps } from "@/core/presentations/components/text-inputs/text-input";

type DatePickerInputProps = {
  value?: DateTime;
  onChange?: (value: DateTime | undefined) => void;
} & Omit<TextInputProps, "type" | "leftIcon" | "value" | "onChange">;

export function DatePickerInput({ value, onChange: onChangeProps, ...restProps }: DatePickerInputProps) {
  const onChange = (dateString: string) => {
    if (dateString) onChangeProps?.(DateTime.fromISO(dateString));
    else onChangeProps?.(undefined);
  };

  return (
    <TextInput
      {...restProps}
      type="date"
      value={value?.toISODate() ?? ""}
      onChange={onChange}
      leftIcon={
        <Image src="/assets/images/calendar-icon-neutral-400-w16-h16.svg" alt="Calendar Icon" width={16} height={16} />
      }
    />
  );
}
