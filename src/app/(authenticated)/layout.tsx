// import { ProtectedPage } from "@/app/(authenticated)/_components/protected-page";
//
// export default function AuthenticatedLayout({ children }: { children: any }) {
//   return (
//     <ProtectedPage>
//       {children}
//       {/*<div className="min-h-full">*/}
//       {/*  <Header />*/}
//       {/*  <PageMain>*/}
//       {/*    {children}*/}
//       {/*  </PageMain>*/}
//       {/*</div>*/}
//     </ProtectedPage>
//   );
// }

import { ProtectedPage } from "@/app/(authenticated)/_components/protected-page";
import { NavigationBar } from "@/app/(authenticated)/_components/navigation-bar";
import { Header } from "@/app/(authenticated)/_components/header";

export default function AuthenticatedLayout(props: { children: React.ReactNode }) {
  return (
    <ProtectedPage>
      <div className="flex size-full flex-row">
        <NavigationBar />
        <div className="flex flex-1 flex-col bg-white">
          <Header />
          <div className="p-8">{props.children}</div>
        </div>
      </div>
    </ProtectedPage>
  );
}
