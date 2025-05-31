import { Label } from "@/core/presentations/components/label";
import { Select, SelectProps } from "@/core/presentations/components/select";

type SelectInputProps = {
  title?: string;
} & SelectProps;

export function SelectInput(props: SelectInputProps) {
  return (
    <>
      {props.title && <Label title={props.title} />}
      <div className={`${props.title && "mt-2"}`}>
        <Select
          data={props.data}
          onChange={props.onChange}
          value={props.value}
          disableFirstOption={props.disableFirstOption}
          required={props.required}
        />
      </div>
    </>
  );
}
