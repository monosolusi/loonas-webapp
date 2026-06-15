import { NeracaProvider } from "@/app/(authenticated)/finance/reports/_providers/neraca-provider";
import { NeracaImpl } from "@/app/(authenticated)/finance/reports/_components/neraca-impl";

export default function ReportsPage() {
  return (
    <NeracaProvider>
      <NeracaImpl />
    </NeracaProvider>
  );
}
