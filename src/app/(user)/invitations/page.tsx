"use client";

import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { LogoImage } from "@/core/presentations/components/logo-image";
import { useListInvitations } from "@/features/member/presentations/hooks/use-list-invitations";
import { InvitationItem } from "@/app/(user)/invitations/_components/invitation-item";

export default function InvitationsPage() {
  const { isLoaded, isSignedIn } = useAuth();
  const { invitations, loading, count } = useListInvitations();

  if (!isLoaded || loading) {
    return (
      <div className="mx-auto flex max-w-2xl flex-col gap-y-8 px-4 py-12">
        <LogoImage className="h-auto w-24" />
        <div className="flex flex-col gap-y-4">
          <div className="h-6 w-48 animate-pulse rounded bg-neutral-100" />
          <div className="h-4 w-72 animate-pulse rounded bg-neutral-100" />
          {[1, 2].map((i) => (
            <div key={i} className="h-20 animate-pulse rounded-lg bg-neutral-100" />
          ))}
        </div>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-y-6 px-4 py-24">
        <LogoImage className="h-auto w-24" />
        <div className="flex flex-col items-center gap-y-2 text-center">
          <h1 className="text-xl font-bold tracking-tight">Masuk untuk melihat undangan</h1>
          <p className="text-sm text-neutral-300">Anda perlu masuk terlebih dahulu untuk melihat undangan keanggotaan.</p>
        </div>
        <Link
          href="/sign-in?redirect_url=/invitations"
          className="rounded-lg bg-primary-300 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-300/90"
        >
          Masuk
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-y-8 px-4 py-12">
      <LogoImage className="h-auto w-24" />

      <div className="flex flex-col gap-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Undangan Keanggotaan</h1>
        <p className="text-sm text-neutral-300">
          {count > 0
            ? `Anda memiliki ${count} undangan yang menunggu respons.`
            : "Tidak ada undangan yang menunggu saat ini."}
        </p>
      </div>

      {count > 0 ? (
        <div className="flex flex-col gap-y-3">
          {invitations.map((invite) => (
            <InvitationItem key={invite.id} invite={invite} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-y-4 rounded-lg border border-neutral-200 bg-white py-16">
          <div className="flex size-14 items-center justify-center rounded-full bg-neutral-50">
            <Image src="/assets/images/user-plus-icon-neutral-200-w32-h32.svg" alt="" width={32} height={32} />
          </div>
          <div className="flex flex-col items-center gap-y-1 text-center">
            <p className="text-sm font-semibold text-neutral-500">Tidak ada undangan</p>
            <p className="text-sm text-neutral-200">Semua undangan sudah direspons.</p>
          </div>
          <Link
            href="/home"
            className="mt-2 text-sm font-medium text-primary-300 transition-colors hover:text-primary-300/80"
          >
            Kembali ke Dashboard
          </Link>
        </div>
      )}
    </div>
  );
}
