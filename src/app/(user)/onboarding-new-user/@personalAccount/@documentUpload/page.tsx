import { FileUploadInput } from "@/core/presentations/components/file-upload-input";

export default function DocumentUploadPage() {
  return (
    <>
      <div className="mb-6 flex flex-col">
        <span className="text-lg leading-6 font-medium text-neutral-500">Upload Dokumen</span>
        <span className="text-sm leading-5 font-medium text-neutral-200">
          Unggah dokumen identitas untuk verifikasi
        </span>
      </div>
      <div className="mb-8 flex flex-col gap-4">
        <div className="flex flex-col gap-1 rounded-xl border border-neutral-200 bg-[#F8F9FA] p-4">
          <span className="text-base leading-6 font-medium text-neutral-500">Panduan Upload:</span>
          <ul className="list-none gap-1 pl-5 text-sm leading-5 font-normal text-neutral-200">
            <li>Pastikan foto KTP jelas dan tidak buram</li>
            <li>Seluruh bagian KTP harus terlihat dalam frame</li>
            <li>Format yang didukung: JPG, PNG, PDF (Max 5MB)</li>
          </ul>
        </div>
        <FileUploadInput label="Dokumen Identitas / KTP" />
      </div>
    </>
  );
}
