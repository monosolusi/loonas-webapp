import { ReactNode } from "react";

interface InvoiceDetailLayoutProps {
  children: ReactNode;
  incomingDetail: ReactNode;
  outgoingDetail: ReactNode;
}

export default function InvoiceDetailLayout({ children, incomingDetail, outgoingDetail }: InvoiceDetailLayoutProps) {
  return (
    <div className="flex flex-col gap-y-6">
      {children}
      {incomingDetail}
      {outgoingDetail}
    </div>
  );
}
