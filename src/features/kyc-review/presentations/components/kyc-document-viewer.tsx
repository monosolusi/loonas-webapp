import Image from "next/image";
import { SectionCard } from "@/core/presentations/components/section-card";
import { KycDocumentEntity } from "@/features/kyc-review/domain/entities/kyc-document";

interface KycDocumentViewerProps {
  documents: KycDocumentEntity[];
}

const IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"];

function isImageUrl(url: string): boolean {
  const lower = url.toLowerCase().split("?")[0];
  return IMAGE_EXTENSIONS.some((ext) => lower.endsWith(ext));
}

function isPdfUrl(url: string): boolean {
  return url.toLowerCase().split("?")[0].endsWith(".pdf");
}

const DOCUMENT_TYPE_LABELS: Record<string, string> = {
  ktp: "KTP",
  id_document: "Dokumen Identitas",
  deed_of_establishment: "Akta Pendirian",
  most_recent_deed_of_amendment: "Akta Perubahan Terakhir",
  business_identification_number: "NIB",
  financial_statement: "Laporan Keuangan",
  financial_bank_statement: "Rekening Koran",
  director_national_identity_card: "KTP Direktur",
};

export function KycDocumentViewer({ documents }: KycDocumentViewerProps) {
  if (documents.length === 0) {
    return (
      <SectionCard title="Dokumen KYC" iconSrc="/assets/images/document-icon-neutral-400-w16-h16.svg">
        <div className="flex items-center justify-center py-8">
          <span className="text-sm text-neutral-300">Tidak ada dokumen.</span>
        </div>
      </SectionCard>
    );
  }

  return (
    <SectionCard
      title="Dokumen KYC"
      iconSrc="/assets/images/document-icon-neutral-400-w16-h16.svg"
      bodyClassName="p-0"
    >
      <div className="divide-y divide-neutral-100">
        {documents.map((doc, index) => (
          <div key={index} className="flex flex-col gap-y-3 p-6">
            <span className="text-sm font-medium text-neutral-500">
              {DOCUMENT_TYPE_LABELS[doc.type] ?? doc.type}
            </span>
            <DocumentPreview url={doc.url} />
          </div>
        ))}
      </div>
    </SectionCard>
  );
}

function DocumentPreview({ url }: { url: string }) {
  if (isImageUrl(url)) {
    return (
      <div className="relative w-full overflow-hidden rounded-lg border border-neutral-100">
        <Image
          src={url}
          alt="Dokumen KYC"
          width={800}
          height={600}
          className="h-auto w-full object-contain"
          unoptimized
        />
      </div>
    );
  }

  if (isPdfUrl(url)) {
    return (
      <iframe src={url} className="h-[500px] w-full rounded-lg border border-neutral-100" title="Dokumen PDF" />
    );
  }

  // Fallback: try rendering as image
  return <img src={url} alt="Dokumen KYC" className="h-auto w-full rounded-lg border border-neutral-100" />;
}
