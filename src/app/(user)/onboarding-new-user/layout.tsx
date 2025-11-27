import React from "react";
import { MarketingPanel } from "@/app/(user)/onboarding-new-user/_components/marketing-panel";

type OnboardingLayoutProps = {
  children: React.ReactNode;
};

export default function OnboardingLayout(props: OnboardingLayoutProps) {
  return (
    <section className="flex size-full flex-row overflow-hidden">
      <div className="w-1/3">
        <MarketingPanel />
      </div>
      <div className="h-full w-2/3 overflow-y-auto bg-neutral-50">
        <div className="px-36 py-12">{props.children}</div>
      </div>
    </section>
  );
}
