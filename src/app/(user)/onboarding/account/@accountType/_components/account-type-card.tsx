import Image from "next/image";

type AccountTypeCardProps = {
  iconPath: string;
  title: string;
  description: string;
  onClick?: () => void;
};

export function AccountTypeCard(props: AccountTypeCardProps) {
  return (
    <div
      className="group hover:border-primary-300 hover:ring-primary-300 flex cursor-pointer flex-col gap-4 rounded-xl border border-neutral-100 p-6 transition-all duration-200 ease-in-out select-none hover:cursor-pointer hover:ring-2"
      onClick={props.onClick}
    >
      <div className="flex flex-row justify-between">
        <div className="bg-primary-300/10 flex size-14 flex-col items-center justify-center rounded-xl p-3.5">
          <Image src={props.iconPath} alt="Person Icon" width={28} height={28} />
        </div>
        <div className="bg-primary-300 flex size-8 flex-col items-center justify-center rounded-full opacity-0 transition-all duration-300 ease-in-out group-hover:opacity-100">
          <Image
            src="/assets/images/arrow-right-icon-white-w16-h16.svg"
            alt="Arrow Right Icon"
            width={20}
            height={20}
          />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-base leading-6 font-medium text-neutral-500">{props.title}</span>
        <span className="text-sm leading-5 font-medium text-neutral-200">{props.description}</span>
      </div>
    </div>
  );
}
