import Image from "next/image";

interface SectionCardProps {
  iconSrc?: string;
  title: string;
  headerAction?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  bodyClassName?: string;
}

export function SectionCard(props: SectionCardProps) {
  return (
    <div className={`flex flex-col rounded-lg border border-neutral-200 bg-white ${props.className ?? ""}`}>
      <div className="flex flex-row items-center gap-x-2 border-b border-b-neutral-100 px-6 py-4">
        {props.iconSrc && <Image src={props.iconSrc} alt="" width={16} height={16} />}
        <div className="leading-6 font-semibold">{props.title}</div>
        {props.headerAction && <div className="ml-auto">{props.headerAction}</div>}
      </div>

      <div className={props.bodyClassName ?? "p-6"}>{props.children}</div>
    </div>
  );
}
