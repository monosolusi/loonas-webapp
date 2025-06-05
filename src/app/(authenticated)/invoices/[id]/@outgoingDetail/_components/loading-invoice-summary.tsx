import React from "react";
import { Card } from "@/core/presentations/components/card";
import { Player } from "@lottiefiles/react-lottie-player";
import LoadingAnimation from "@/app/(authenticated)/invoices/[id]/@outgoingDetail/_static-files/loading.json";

export function LoadingInvoiceSummary() {
  return (
    <Card>
      <div className="flex size-24 flex-row justify-self-center">
        <Player src={LoadingAnimation} autoplay loop />
      </div>
    </Card>
  );
}
