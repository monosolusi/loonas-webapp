import { PaymentSchemeEntity } from "@/features/payment/domain/entities/payment-scheme";
import React from "react";

export function AvailableScheme({ schemes }: { schemes: PaymentSchemeEntity[] }) {
  if (schemes.length === 0) return null;
  return (
    <div className="flex items-center space-x-1 text-xs text-gray-500">
      {schemes
        .map((scheme) => <span key={scheme.id}>{scheme.name}</span>)
        .reduce((prev, curr, i) => {
          return [prev, <span key={i} className="mx-1">•</span>, curr] as any;
        })
      }
    </div>
  );
}