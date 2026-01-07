import clsx from "clsx";
import Image from "next/image";

type StatusBoxIconProps = {
  icon: string; // Path to icon
  backgroundColor: string; // The wrapper background color
  borderColor: string; // The wrapper border color
};

export function StatusBoxIcon(props: StatusBoxIconProps) {
  return (
    <div
      className={clsx(
        "flex flex-col items-center justify-center rounded-lg border p-5",
        `${props.backgroundColor} ${props.borderColor}`,
      )}
    >
      <Image src={props.icon} alt="Status Icon" width={48} height={48} />
    </div>
  );
}
