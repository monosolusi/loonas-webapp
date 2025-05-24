import React from "react";
import { GetPartnerProvider } from "@/features/partner/presentation/providers/get-partner";
import { BackArrow } from "@/core/presentations/components/back-arrow";
import { PageHeadingImpl } from "@/app/(authenticated)/clients/[id]/_component/page-heading-impl";
import { PageContent } from "@/core/presentations/components/page-content";
import { SideNavigation } from "@/app/(authenticated)/clients/[id]/_component/navigation";


interface ClientDetailLayoutProps {
  children: React.ReactNode,
  params: Promise<{ id: string }>
}

export default async function ClientDetailLayout(props: ClientDetailLayoutProps) {
  const { id } = await props.params;

  return (
    <GetPartnerProvider id={id}>
      <div className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
        <BackArrow />
      </div>
      <PageHeadingImpl />
      <PageContent>
        <div className="flex flex-row mx-auto max-w-7xl">
          <SideNavigation />
          <main className="flex px-4 sm:px-6 lg:flex-auto py-4">
            <div className="w-full">
              {props.children}
            </div>
          </main>
        </div>
      </PageContent>
    </GetPartnerProvider>
  );
}
