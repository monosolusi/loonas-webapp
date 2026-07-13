import { CreateOutgoingInvoiceProvider } from "@/app/(authenticated)/invoices/outgoing/create/_providers/create-outgoing-invoice";
import { CreateNewPartnerProvider } from "@/features/partner/presentation/providers/create-new-partner";
import { AddItemProvider } from "@/app/(authenticated)/invoices/outgoing/create/@items/_providers/add-item";
import { CreateOutgoingSteppers } from "@/app/(authenticated)/invoices/outgoing/create/_components/create-outgoing-steppers";
import { CreateOutgoingActionBar } from "@/app/(authenticated)/invoices/outgoing/create/_components/create-outgoing-action-bar";
import { WizardHeader } from "@/app/(authenticated)/invoices/outgoing/create/_components/wizard-header";
import { CreateOutgoingInvoiceLayoutProps } from "@/app/(authenticated)/invoices/outgoing/create/layout.types";
import { RequireAccountBankAccount } from "@/features/bank/presentation/components/require-account-bank-account";

export default function CreateOutgoingInvoiceLayout(props: CreateOutgoingInvoiceLayoutProps) {
  return (
    <RequireAccountBankAccount>
      <CreateOutgoingInvoiceProvider>
        <CreateNewPartnerProvider>
          <AddItemProvider>
            <div className="flex flex-col gap-y-8">
              <WizardHeader />

              <div className="rounded-lg border border-neutral-200">
                <div className="flex flex-row">
                  <CreateOutgoingSteppers />

                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex-1 px-12 py-8">
                      {props.recipient}
                      {props.addClient}
                      {props.items}
                      {props.addItem}
                      {props.payment}
                      {props.review}
                    </div>

                    <CreateOutgoingActionBar />
                  </div>
                </div>
              </div>
            </div>
          </AddItemProvider>
        </CreateNewPartnerProvider>
      </CreateOutgoingInvoiceProvider>
    </RequireAccountBankAccount>
  );
}
