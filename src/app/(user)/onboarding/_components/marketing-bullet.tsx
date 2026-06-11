import Image from "next/image";

type MarketingBulletProps = {
  iconPath: string;
  title: string;
};

export function MarketingBullet(props: MarketingBulletProps) {
  return (
    <div className="flex flex-row items-center gap-3">
      <div className="flex size-9 flex-row items-center justify-center rounded-lg bg-neutral-50/10">
        <Image src={props.iconPath} alt="Icon" width={20} height={20} />
      </div>
      <span className="text-sm leading-5 font-normal text-neutral-50/90">{props.title}</span>
    </div>
  );
}
