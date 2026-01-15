// import React from "react";
// import { PageContent } from "@/core/presentations/components/page-content";
// import { CreateIncomingInvoiceProgressBar } from "@/app/(authenticated)/invoices/incoming/create/_components/progress-bar";
// import { CreateIncomingInvoiceProvider } from "@/features/invoice/presentations/providers/create-incoming-invoice";
// import { CreateIncomingInvoiceStepsProvider } from "@/features/invoice/presentations/providers/create-incoming-invoice-steps";
// import { CustomBackArrow } from "./_components/custom-back-arrow";
// import { PageHeading } from "@/core/presentations/components/page-heading";
//
// interface CreateIncomingInvoiceLayoutProps {
//   children: React.ReactNode;
//   recipients: React.ReactNode;
//   banks: React.ReactNode;
//   upload: React.ReactNode;
//   payment: React.ReactNode;
// }
//
// export default function CreateIncomingInvoiceLayout(props: CreateIncomingInvoiceLayoutProps) {
//   return (
//     <CreateIncomingInvoiceProvider>
//       <CreateIncomingInvoiceStepsProvider>
//         <PageHeading>Faktur Masukan</PageHeading>
//         <PageContent>
//           <div className="flex flex-col space-y-12">
//             <div className="flex flex-col space-y-2">
//               <div className="flex flex-row items-start">
//                 <CustomBackArrow />
//               </div>
//               <CreateIncomingInvoiceProgressBar />
//             </div>
//             <div>
//               {props.recipients}
//               {props.banks}
//               {props.upload}
//               {props.payment}
//             </div>
//           </div>
//         </PageContent>
//       </CreateIncomingInvoiceStepsProvider>
//     </CreateIncomingInvoiceProvider>
//   );
// }

import { CreateInvoiceStepper } from "@/features/invoice/presentations/components/create-invoice-stepper";
import { SecondaryButton } from "@/core/presentations/components/buttons/secondary-button";
import { PrimaryButton } from "@/core/presentations/components/buttons/primary-button";
import { CreateIncomingInvoiceLayoutProps } from "@/app/(authenticated)/invoices/incoming/create/layout.types";

export default function CreateIncomingInvoiceLayout(props: CreateIncomingInvoiceLayoutProps) {
  return (
    <div className="flex flex-col gap-y-8">
      {/* Title & Description */}
      <div className="flex flex-col">
        <div className="text-2xl leading-8 font-bold tracking-tighter">Buat Faktur Masukan</div>
        <div className="text-base leading-6 font-normal text-neutral-300">
          Bayar faktur dari Client kamu disini. Ikuti langkah-langkah dibawah ini untuk mencatat faktur masukan baru
        </div>
      </div>

      {/*  Card Section */}
      <div className="rounded-lg border border-neutral-200">
        <div className="flex flex-row">
          {/*  Left - Progress */}
          <div className="w-[320px] border-r border-neutral-200 px-6 py-8">
            <div className="flex flex-col gap-y-1">
              <CreateInvoiceStepper
                title="Client"
                description="Pilih Client"
                iconPath={{
                  default: "/assets/images/person-icon-neutral-400-w28-h28.svg",
                  active: "/assets/images/person-icon-primary-w28-h28.svg",
                }}
                state="active"
              />

              <CreateInvoiceStepper
                title="Detail"
                description="Isi faktur"
                iconPath={{
                  default: "/assets/images/document-icon-neutral-400-w16-h16.svg",
                  active: "/assets/images/document-icon-primary-300-w16-h16.svg",
                }}
              />

              <CreateInvoiceStepper
                title="Rekening"
                description="Tujuan transfer"
                iconPath={{
                  default: "/assets/images/building-icon-neutral-400-w16-h16.svg",
                  active: "/assets/images/building-icon-primary-w28-h28.svg",
                }}
              />

              <CreateInvoiceStepper
                title="Metode Pembayaran"
                description="Cara bayar"
                iconPath={{
                  default: "/assets/images/credit-card-icon-neutral-400-w16-h16.svg",
                  active: "/assets/images/credit-card-icon-primary-300-w16-h16.svg",
                }}
              />

              <CreateInvoiceStepper
                title="Bayar"
                description="Lakukan pembayaran"
                iconPath={{
                  default: "/assets/images/dollar-icon-neutral-400-w16-h16.svg",
                  active: "/assets/images/dollar-icon-primary-300-w16-h16.svg",
                }}
              />

              <CreateInvoiceStepper
                title="Selesai"
                description="Faktur telah dibuat"
                iconPath={{
                  default: "/assets/images/check-circle-icon-neutral-400-w16-h16.svg",
                  active: "/assets/images/check-circle-icon-primary-300-w16-h16.svg",
                }}
              />
            </div>
          </div>

          {/*  Right - Content */}
          <div className="flex flex-1 flex-col">
            <div className="flex-1 px-12 py-8">{props.recipients}</div>

            {/*  Action Buttons */}
            <div className="flex flex-row items-center justify-between border-t border-t-neutral-200 p-6">
              <div className="flex">
                <SecondaryButton label="Batalkan" outlined />
              </div>
              <div className="flex">
                <PrimaryButton label="Lanjutkan" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
