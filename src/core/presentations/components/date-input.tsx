import { TextInput, TextInputProps } from "@/core/presentations/components/text-input";
import { DateTime } from "luxon";

type DateInputProps = {
  onChange?: (value: DateTime) => void;
  value?: DateTime;
} & Omit<TextInputProps, "type" | "onChange" | "value">;

export function DateInput(props: DateInputProps) {
  const handleChange = (value: string) => {
    if (!props.onChange) return;

    const tDate = DateTime.fromFormat(value, "yyyy-MM-dd");
    props.onChange(tDate);
  };

  return (
    <TextInput
      {...props}
      type="date"
      value={props.value?.toFormat("yyyy-MM-dd")}
      onChange={handleChange}
    />
  );
}
