import Image from "next/image";
import clsx from "clsx";

type TimelineItemProps = {
  backgroundColor: string;
  icon?: string;
  title: string;
  description: string;
  isLast?: boolean;
};

export function TimelineItem(props: TimelineItemProps) {
  return (
    <div className="flex flex-row items-start gap-x-4">
      <div className="flex h-full flex-col items-center gap-y-1">
        <div className={clsx(props.backgroundColor, "flex size-8 flex-col items-center justify-center rounded-full")}>
          {props.icon && <Image src={props.icon} alt="Check Icon" width={20} height={20} />}
        </div>
        {!props.isLast && <div className="h-[40px] w-[2px] bg-neutral-100"></div>}
      </div>
      <div className="flex flex-col gap-y-1">
        <div className="text-sm leading-5 font-semibold">{props.title}</div>
        <div className="text-sm leading-5 font-normal text-neutral-200">{props.description}</div>
      </div>
    </div>
  );
}
