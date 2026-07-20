import React from "react";
import { MarketingPanel } from "@/app/(user)/onboarding/_components/marketing-panel";

type OnboardingLayoutProps = {
  children: React.ReactNode;
};

export default function OnboardingLayout(props: OnboardingLayoutProps) {
  return (
    <section className="flex size-full flex-row overflow-hidden">
      <div className="hidden lg:block lg:w-1/3">
        <MarketingPanel />
      </div>
      <div className="h-full w-full overflow-y-auto bg-neutral-50 lg:w-2/3">
        <div className="px-4 py-8 lg:px-36 lg:py-12">{props.children}</div>
      </div>
    </section>
  );
}
