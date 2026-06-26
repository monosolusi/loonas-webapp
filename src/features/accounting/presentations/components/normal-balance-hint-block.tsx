import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { NormalBalanceHintLine } from "@/features/accounting/domain/entities/normal-balance-hint";

function formatSide(side: "debit" | "credit"): string {
  return side === "debit" ? "Debit" : "Kredit";
}

type ResolvedAccount = { name: string; code: string };

type NormalBalanceHintBlockProps = {
  lines: NormalBalanceHintLine[];
  resolveAccount?: (accountId: string) => ResolvedAccount | undefined;
};

export function NormalBalanceHintBlock({ lines, resolveAccount }: NormalBalanceHintBlockProps) {
  return (
    <div
      role="alert"
      aria-live="assertive"
      className="rounded-lg border border-error-100 bg-error-50 p-4"
    >
      <div className="flex gap-3">
        <ExclamationCircleIcon className="mt-0.5 size-5 shrink-0 text-error-400" aria-hidden="true" />
        <div className="flex-1">
          <p className="text-sm font-semibold text-error-500">Cek arah pengisian akun berikut</p>
          <p className="mt-1 text-sm text-neutral-500">
            Beberapa akun diisi pada sisi yang berlawanan dengan saldo normalnya. Koreksi sesuai petunjuk di bawah ini,
            lalu coba simpan kembali.
          </p>
          <p className="mt-1 text-sm text-neutral-500">
            Singkatnya: akun untuk hal yang <span className="font-medium text-neutral-600">Anda miliki</span> (kas, stok,
            piutang) bertambah di sisi <span className="font-medium text-neutral-600">Debit</span>, sedangkan akun untuk
            utang dan modal usaha bertambah di sisi <span className="font-medium text-neutral-600">Kredit</span>. Aturan
            arah inilah yang disebut &ldquo;saldo normal&rdquo;.
          </p>
          {lines.length > 0 && (
            <ul role="list" className="mt-3 space-y-1">
              {lines.map((line, index) => {
                const resolved = resolveAccount?.(line.accountId);
                const label = resolved
                  ? `${resolved.name} (${resolved.code})`
                  : `Akun (${line.accountId})`;
                return (
                  <li key={`${line.accountId}-${index}`} className="text-sm text-neutral-500">
                    {label} — Anda mengisi sisi {formatSide(line.enteredSide)}, saldo normal akun ini adalah{" "}
                    {formatSide(line.correctedSide)}.
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
