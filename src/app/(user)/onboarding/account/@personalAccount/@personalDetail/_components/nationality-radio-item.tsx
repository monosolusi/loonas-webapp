import Image from "next/image";
import clsx from "clsx";

type NationalityRadioItemProps = {
  name: string;
  uncheckedIconPath: string;
  checkedIconPath: string;
  title: string;
  description: string;
  disabled?: boolean;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
};

export function NationalityRadioItem(props: NationalityRadioItemProps) {
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    props.onChange?.(e.target.checked);
  };

  return (
    <label
      className={clsx(
        "group has-checked:outline-primary-300 relative flex flex-row gap-3 rounded-xl border-2 border-neutral-100 p-6 has-checked:outline-2 has-checked:-outline-offset-2",
        props.disabled && "cursor-not-allowed opacity-50",
      )}
    >
      <input
        type="radio"
        name={props.name}
        checked={props.checked}
        onChange={onChange}
        disabled={props.disabled}
        className="absolute inset-0 appearance-none focus:outline-none disabled:cursor-not-allowed"
      />
      <div className="group-has-checked:bg-primary-300/20 flex size-10 flex-col items-center justify-center rounded-xl bg-[#F5F5F5]">
        <Image className="group-has-checked:hidden" src={props.uncheckedIconPath} alt="Icon" width={20} height={20} />
        <Image
          className="hidden group-has-checked:block"
          src={props.checkedIconPath}
          alt="Icon"
          width={20}
          height={20}
        />
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-base leading-5 font-medium">{props.title}</span>
        <span className="text-sm leading-4 font-normal text-neutral-200">{props.description}</span>
      </div>
    </label>
  );
}
