import Image from "next/image";

type FeatureItemProps = {
  iconPath: string;
  label: string;
};

export function FeatureItem(props: FeatureItemProps) {
  return (
    <div className="flex flex-row items-center gap-3">
      <div className="flex h-8 w-8 flex-row items-center justify-center rounded-lg border-white/20 bg-white/20">
        <Image src="/assets/images/analytic-icon-w16-h16.svg" alt="Analytic Icon" width={16} height={16} />
      </div>
      <span className="text-base text-white/95">Pantau pertumbuhan real-time</span>
    </div>
  );
}
