// "use client";
//
// import React, { useEffect } from "react";
// import { SchemeSelection } from "@/app/(authenticated)/invoices/incoming/create/@payment/_components/scheme-selection";
// import { PaymentMethod } from "@/app/(authenticated)/invoices/incoming/create/@payment/_components/payment-method";
// import { RecipientInfo } from "@/app/(authenticated)/invoices/incoming/create/@payment/_components/recipient-info";
// import { BankAccountInfo } from "@/app/(authenticated)/invoices/incoming/create/@payment/_components/bank-account-info";
// import { InvoiceList } from "@/app/(authenticated)/invoices/incoming/create/@payment/_components/invoice-list";
// import { Totals } from "@/app/(authenticated)/invoices/incoming/create/@payment/_components/totals";
// import { PayNowButton } from "@/app/(authenticated)/invoices/incoming/create/@payment/_components/pay-now-button";
// import { useCreateIncomingInvoiceSteps } from "@/features/invoice/presentations/providers/create-incoming-invoice-steps";
// import { useListPaymentMethod } from "@/features/payment/presentations/hooks/use-list-payment-method";
//
// export default function PaymentMethodPage() {
//   const { currentStep } = useCreateIncomingInvoiceSteps();
//   const { loading } = useListPaymentMethod();
//
//   if (currentStep !== 4) return null;
//   if (loading) return <div className="mt-4">Loading payment methods...</div>;
//   return (
//     <div>
//       <div className="mb-6 sm:flex sm:items-center">
//         <div className="sm:flex-auto">
//           <h1 className="text-base font-semibold text-gray-900">Pilih Metode Pembayaran</h1>
//           <p className="mt-2 text-sm text-gray-700">
//             Pilih metode pembayaran yang ingin kamu gunakan untuk membayar faktur ini.
//           </p>
//         </div>
//       </div>
//
//       <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
//         {/* Left column - Payment methods */}
//         <div className="lg:col-span-2">
//           <PaymentMethod />
//           <SchemeSelection />
//         </div>
//
//         {/* Right column - Payment details */}
//         <div className="rounded-lg bg-gray-100 p-6">
//           <h2 className="mb-4 text-base font-semibold text-gray-900">Detail Pembayaran</h2>
//           <RecipientInfo />
//           <BankAccountInfo />
//           <InvoiceList />
//           <Totals />
//
//           <div className="mt-6">
//             <PayNowButton />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

export default function NothingPage() {
  return <></>;
}
