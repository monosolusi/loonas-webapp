// "use client";
//
// import Link from "next/link";
// import React, { useState } from "react";
// import { Bars3Icon } from "@heroicons/react/20/solid";
// import { XMarkIcon } from "@heroicons/react/24/outline";
// import { Dialog, DialogPanel } from "@headlessui/react";
// import { HeaderAccountList } from "@/app/(authenticated)/_components/header-account-list";
//
// const navigation = [
//   { name: "Home", href: "/home" },
//   { name: "Faktur Digital", href: "/invoices" },
//   { name: "Klien", href: "/clients" }
// ];
//
// export function Header() {
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//
//   return (
//     <header className="absolute inset-x-0 top-0 z-5 flex h-16 border-b border-gray-900/10">
//       <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
//         <div className="flex flex-1 items-center gap-x-6">
//           <button type="button" onClick={() => setMobileMenuOpen(true)} className="-m-3 p-3 md:hidden">
//             <span className="sr-only">Open main menu</span>
//             <Bars3Icon aria-hidden="true" className="size-5 text-gray-900" />
//           </button>
//           <img
//             alt="Loonas"
//             src="https://res.cloudinary.com/monosolusi/image/upload/v1740993366/loonas/web-assets/loonas-logo_rspb5c.svg"
//             className="h-10 w-auto lg:h-12"
//           />
//         </div>
//         <nav className="hidden md:flex md:gap-x-11 md:text-sm/6 md:font-semibold md:text-gray-700">
//           {navigation.map((item, itemIdx) => (
//             <a key={itemIdx} href={item.href}>
//               {item.name}
//             </a>
//           ))}
//         </nav>
//         <div className="hidden sm:flex flex-1 items-center justify-end gap-x-8">
//           <HeaderAccountList />
//         </div>
//       </div>
//       <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
//         <div className="fixed inset-0 z-50" />
//         <DialogPanel
//           className="fixed inset-y-0 left-0 z-50 w-full overflow-y-auto bg-white px-4 pb-6 sm:max-w-sm sm:px-6 sm:ring-1 sm:ring-gray-900/10">
//           <div className="-ml-0.5 flex h-16 items-center gap-x-6">
//             <button type="button" onClick={() => setMobileMenuOpen(false)} className="-m-2.5 p-2.5 text-gray-700">
//               <span className="sr-only">Close menu</span>
//               <XMarkIcon aria-hidden="true" className="size-6" />
//             </button>
//             <div className="-ml-0.5">
//               <a href="#" className="-m-1.5 block p-1.5">
//                 <span className="sr-only">Loonas</span>
//                 <img
//                   alt="Loonas"
//                   src="https://res.cloudinary.com/monosolusi/image/upload/v1740993366/loonas/web-assets/loonas-logo_rspb5c.svg"
//                   className="h-10 w-auto"
//                 />
//               </a>
//             </div>
//           </div>
//           <div className="mt-2">
//             <HeaderAccountList />
//           </div>
//           <div className="mt-2 space-y-2">
//             {navigation.map((item) => (
//               <Link
//                 key={item.name}
//                 href={item.href}
//                 className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
//               >
//                 {item.name}
//               </Link>
//             ))}
//           </div>
//         </DialogPanel>
//       </Dialog>
//     </header>
//   );
// }

import Image from "next/image";
import { HeaderTitle } from "@/app/(authenticated)/_components/header-title";
import { HeaderAccountItem } from "@/app/(authenticated)/_components/header-account-item";

export function Header() {
  return (
    <div className="flex flex-row items-center justify-between border-b border-b-neutral-200 px-6 py-2">
      <HeaderTitle />
      <div className="flex flex-row items-center gap-x-6">
        {/* Notification Icon */}
        <div className="flex size-10 flex-col items-center justify-center">
          <div className="relative">
            <Image src="/assets/images/bell-icon-neutral-300-w16-h16.svg" alt="bell icon" width={16} height={16} />
            <div className="bg-error-300 absolute top-[-2px] right-[-2px] size-2 rounded-full border border-2 border-white"></div>
          </div>
        </div>

        {/* Vertical Divider */}
        <div className="h-6 w-[2px] bg-neutral-200"></div>

        <HeaderAccountItem />
      </div>
    </div>
  );
}
