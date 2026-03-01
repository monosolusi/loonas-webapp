import Image from "next/image";

export function DashboardWelcomeHeader() {
  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-col gap-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-neutral-500">Selamat Datang, Jerry 👋</h1>
        <p className="text-sm text-neutral-300">Berikut ringkasan keuangan bisnis Anda hari ini.</p>
      </div>
      <div className="flex items-center gap-x-2 rounded-lg bg-neutral-50 px-3 py-2">
        <Image src="/assets/images/calendar-icon-neutral-400-w16-h16.svg" alt="" width={16} height={16} />
        <span className="text-sm text-neutral-400">28 Februari 2026</span>
      </div>
    </div>
  );
}
