import { CreateIncomingInvoiceLayoutProps } from "@/app/(authenticated)/invoices/incoming/create/layout.types";
import { CreateIncomingInvoiceStepsProvider } from "@/features/invoice/presentations/providers/create-incoming-invoice-steps";
import { CreateClientButton } from "@/features/invoice/presentations/components/create-client-button";
import { CreateIncomingNextButton } from "@/features/invoice/presentations/components/create-incoming-next-button";
import { CreateNewPartnerProvider } from "@/features/partner/presentation/providers/create-new-partner";
import { CreateClientCancelButton } from "@/features/invoice/presentations/components/create-client-cancel-button";
import { CreateIncomingCancelButton } from "@/features/invoice/presentations/components/create-incoming-cancel-button";
import { CreateIncomingInvoiceProvider } from "@/features/invoice/presentations/providers/create-incoming-invoice";
import { CreateIncomingBackButton } from "@/features/invoice/presentations/components/create-incoming-back-button";
import { CreatePartnerBankAccountCancelButton } from "@/features/invoice/presentations/components/create-partner-bank-account-cancel-button";
import { VerifyBankAccountButton } from "@/features/invoice/presentations/components/verify-bank-account-button";
import { CreatePartnerBankAccountWrapperForIncomingInvoice } from "@/features/invoice/presentations/providers/create-partner-bank-account-wrapper-for-incoming-invoice";
import { CreateBankAccountButton } from "@/features/invoice/presentations/components/create-bank-account-button";
import { CreateIncomingSaveButton } from "@/features/invoice/presentations/components/create-incoming-save-button";
import { CreateIncomingSteppersWrapperForCreateIncomingPage } from "@/features/invoice/presentations/components/create-incoming-steppers-wrapper-for-create-incoming-page";
import { CreateIncomingMobileProgress } from "@/app/(authenticated)/invoices/incoming/create/_components/create-incoming-mobile-progress";

export default function CreateIncomingInvoiceLayout(props: CreateIncomingInvoiceLayoutProps) {
  return (
    <CreateIncomingInvoiceStepsProvider>
      <CreateIncomingInvoiceProvider>
        <CreateNewPartnerProvider>
          <CreatePartnerBankAccountWrapperForIncomingInvoice>
            <div className="flex flex-col gap-y-8">
              {/* Title & Description */}
              <div className="flex flex-col">
                <div className="text-2xl leading-8 font-bold tracking-tighter">Buat Faktur Masukan</div>
                <div className="text-base leading-6 font-normal text-neutral-300">
                  Bayar faktur dari Client kamu disini. Ikuti langkah-langkah dibawah ini untuk mencatat faktur masukan
                  baru
                </div>
              </div>

              {/*  Card Section */}
              <div className="rounded-lg border border-neutral-200">
                <div className="flex flex-col lg:flex-row">
                  {/*  Left - Progress */}
                  <div className="hidden lg:block">
                    <CreateIncomingSteppersWrapperForCreateIncomingPage />
                  </div>
                  <CreateIncomingMobileProgress />

                  {/*  Right - Content */}
                  <div className="flex flex-1 flex-col">
                    <div className="flex-1 px-4 py-6 lg:px-12 lg:py-8">
                      {props.recipients}
                      {props.addClient}
                      {props.invoices}
                      {props.clientBankAccount}
                      {props.addPartnerBankAccount}
                      {props.selectPaymentMethod}
                    </div>

                    {/*  Action Buttons */}
                    <div className="sticky bottom-0 z-10 flex flex-row items-center justify-between gap-3 border-t border-t-neutral-200 bg-white px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] lg:static lg:gap-0 lg:px-6 lg:py-6 lg:pb-6">
                      <div className="flex">
                        <CreateIncomingBackButton />
                        <CreateIncomingCancelButton />
                        <CreateClientCancelButton />
                        <CreatePartnerBankAccountCancelButton />
                      </div>
                      <div className="flex">
                        <CreateIncomingNextButton />
                        <CreateClientButton />
                        <VerifyBankAccountButton />
                        <CreateBankAccountButton />
                        <CreateIncomingSaveButton />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CreatePartnerBankAccountWrapperForIncomingInvoice>
        </CreateNewPartnerProvider>
      </CreateIncomingInvoiceProvider>
    </CreateIncomingInvoiceStepsProvider>
  );
}
