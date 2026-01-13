import { AccountCard } from "@/app/(authenticated)/accounts/_components/account-card";

export default function AccountManagementPage() {
  return (
    <div className="flex flex-col gap-y-8">
      {/*  Header Title & Description */}
      <div className="flex flex-col gap-y-2">
        <div className="text-3xl leading-9 font-bold tracking-tight">Daftar Akun</div>
        <div className="leading-6 text-neutral-300">
          Lihat ringkasan dan kelola semua akun yang terhubung dengan profil Anda di sini.
        </div>
      </div>

      {/*  List of Account */}
      <div className="flex w-full flex-row flex-wrap gap-6">
        <AccountCard />
        <AccountCard />
        <AccountCard />
        <AccountCard />
        <AccountCard />
        <AccountCard />
      </div>
    </div>
  );
}
