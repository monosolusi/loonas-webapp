"use client";

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useGetInvoice } from "@/features/invoice/presentations/hooks/use-get-invoice";
import { InvoiceType } from "@/features/invoice/domain/enums/invoice-type";

export default function InvoiceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { invoice } = useGetInvoice({ id });

  const title = invoice?.type === InvoiceType.OUTGOING ? "Faktur Keluaran" : "Faktur Masukan";
  const shortId = id.slice(0, 8);
  const createdDate = invoice?.createdAt.setLocale("id").toFormat("dd LLL yyyy");

  return (
    <div className="flex flex-row items-center gap-x-4">
      <button
        onClick={() => router.back()}
        className="flex size-9 cursor-pointer flex-col items-center justify-center rounded-lg border border-neutral-100"
      >
        <Image
          src="/assets/images/arrow-left-icon-neutral-500-w16-h16.svg"
          alt="arrow-left-icon"
          width={16}
          height={16}
        />
      </button>

      <div className="flex flex-col gap-y-1">
        <div className="text-xl leading-5 font-bold tracking-tight">{title}</div>
        <div className="text-sm leading-5 text-neutral-200">
          ID: {shortId}{createdDate ? ` · ${createdDate}` : ""}
        </div>
      </div>
    </div>
  );
}
