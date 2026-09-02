import { ListPageHeader } from "@/core/presentations/components/list-page-header";
import { BalanceSummaryCard } from "@/app/(authenticated)/balance/_components/balance-summary-card";
import { BalanceMovementTable } from "@/app/(authenticated)/balance/_components/balance-movement-table";

export default function BalancePage() {
  return (
    <div className="flex flex-col gap-y-6">
      <ListPageHeader title="Saldo" subtitle="Saldo dana Anda di Loonas. Berbeda dari saldo akun di menu Akuntansi." />
      <BalanceSummaryCard />
      <BalanceMovementTable />
    </div>
  );
}
