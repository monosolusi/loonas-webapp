// "use client";
//
// import React from "react";
// import { RowItem } from "@/app/(authenticated)/invoices/incoming/create/@recipients/_components/row-item";
// import { useCreateIncomingInvoiceSteps } from "@/features/invoice/presentations/providers/create-incoming-invoice-steps";
// import { useListPartner } from "@/features/partner/presentation/hooks/use-list-partner";
// import { NewClientButton } from "@/features/partner/presentation/components/new-client-button";
//
// function SelectRecipientContent() {
//   const { partners, loading } = useListPartner();
//
//   return (
//     <div>
//       <div className="sm:flex sm:items-center">
//         <div className="sm:flex-auto">
//           <h1 className="text-base font-semibold text-gray-900">Klien</h1>
//           <p className="mt-2 text-sm text-gray-700">Pilih klien yang ingin kamu lakukan pembayaran, yuk!</p>
//         </div>
//         <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
//           <NewClientButton label="Buat Klien Baru" />
//         </div>
//       </div>
//       <div className="mt-8 flow-root">
//         <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
//           <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
//             <div className="overflow-hidden shadow-sm ring-1 ring-black/5 sm:rounded-lg">
//               <table className="min-w-full divide-y divide-gray-300">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th scope="col" className="py-3.5 pr-3 pl-4 text-left text-sm font-semibold text-gray-900 sm:pl-6">
//                       Nama
//                     </th>
//                     <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
//                       Email
//                     </th>
//                     <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
//                       No. Telpon
//                     </th>
//                     <th scope="col" className="relative py-3.5 pr-4 pl-3 sm:pr-6">
//                       <span className="sr-only">Pilih</span>
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-200 bg-white">
//                   {loading ? (
//                     <tr>
//                       <td colSpan={4} className="py-4 text-center text-sm text-gray-500">
//                         Loading...
//                       </td>
//                     </tr>
//                   ) : partners.length === 0 ? (
//                     <tr>
//                       <td colSpan={4} className="py-4 text-center text-sm text-gray-500">
//                         Tidak ada klien yang ditemukan
//                       </td>
//                     </tr>
//                   ) : (
//                     partners.map((partner) => <RowItem partner={partner} key={partner.id} />)
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
//
// export default function SelectRecipientPage() {
//   const { currentStep } = useCreateIncomingInvoiceSteps();
//
//   if (currentStep !== 1) return null;
//   return <SelectRecipientContent />;
// }

import Image from "next/image";
import { SelectorItem } from "@/features/invoice/presentations/components/selector-item";
import { SecondaryButton } from "@/core/presentations/components/buttons/secondary-button";

export default function SelectClientSection() {
  return (
    <div className="flex flex-col gap-y-6">
      {/* Title & Description */}
      <div className="flex flex-col">
        <div className="text-2xl leading-8 font-bold text-neutral-400">Pilih Klien</div>
        <div className="text-base leading-6 font-normal">Siapa yang mengirim faktur ini?</div>
      </div>

      {/*  Search Bar */}
      <div className="w-full rounded-md border border-neutral-200 px-3 py-3.5">
        <div className="flex flex-row gap-x-2">
          <Image src="/assets/images/search-icon-neutral-400-w20-h20.svg" alt="search icon" width={20} height={20} />
          <input
            type="text"
            className="w-full placeholder-neutral-300 focus:outline-none"
            placeholder="Cari nama klien..."
          />
        </div>
      </div>

      {/*  List of Client */}
      <div className="flex max-h-[350px] flex-col overflow-y-auto rounded-lg border border-neutral-200">
        <SelectorItem title="PT Sumber Makmur" description="finance@sumbermakmur.co.id" />
        <SelectorItem title="CV Teknologi Abadi" description="admin@teknologiabadi.com" state="active" />
        <SelectorItem title="Office Supplies Co." description="order@officesupplies.id" showBorder={false} />
      </div>

      <SecondaryButton
        label="Tambah Klien Baru"
        leftIcon={
          <Image src="/assets/images/plus-icon-neutral-400-w24-h24.svg" alt="Plus Icon" width={16} height={16} />
        }
        outlined
      />
    </div>
  );
}
