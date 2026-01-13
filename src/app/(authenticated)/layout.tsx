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

export default function AuthenticatedLayout(props: { children: React.ReactNode }) {
  return (
    <ProtectedPage>
      <div className="flex size-full flex-row">
        <NavigationBar />
        <div className="flex flex-1 bg-white"></div>
      </div>
    </ProtectedPage>
  );
}
