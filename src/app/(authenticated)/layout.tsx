import { ProtectedPage } from "@/app/(authenticated)/_components/protected-page";

export default function AuthenticatedLayout({ children }: { children: any }) {
  return (
    <ProtectedPage>
      <></>
      {/*<div className="min-h-full">*/}
      {/*  <Header />*/}
      {/*  <PageMain>*/}
      {/*    {children}*/}
      {/*  </PageMain>*/}
      {/*</div>*/}
    </ProtectedPage>
  );
}
