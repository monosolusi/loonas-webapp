"use client";

import React, { useEffect, useState } from "react";
import { ServerError, ErrorCodes } from "@/core/resources/server-error";
import { DataFailed } from "@/core/resources/data-state";
import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { LocalStorageSessionService } from "@/features/authentication/data/sources/local-storage-session";
import { PaymentGatewayEntity } from "../../domain/entities/payment-gateway";
import { PaymentGatewayRepositoryImpl } from "../../data/repositories/payment-gateway";
import { PaymentGatewayServiceImpl } from "../../data/sources/payment-gateway";
import { ListPaymentGatewaysUseCase } from "../../domain/usecases/list-payment-gateways";

interface PaymentGatewayContextProps {
  paymentGateways: PaymentGatewayEntity[];
  loading: boolean;
  error?: ServerError;
  refreshPaymentGateways?: () => Promise<void>;
}

const PaymentGatewayContext = React.createContext<PaymentGatewayContextProps>({
  paymentGateways: [],
  loading: false
});

export function PaymentGatewayProvider({ children }: { children: React.ReactNode }) {
  const [paymentGateways, setPaymentGateways] = useState<PaymentGatewayEntity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<ServerError | undefined>(undefined);

  async function fetchPaymentGateways() {
    setLoading(true);
    setError(undefined);

    try {
      const sessionService = new LocalStorageSessionService();
      const sessionRepository = new SessionRepositoryImpl(sessionService);
      const paymentGatewayService = new PaymentGatewayServiceImpl();
      const paymentGatewayRepository = new PaymentGatewayRepositoryImpl(paymentGatewayService);
      const listPaymentGateways = new ListPaymentGatewaysUseCase(paymentGatewayRepository, sessionRepository);

      const result = await listPaymentGateways.execute();
      if (result instanceof DataFailed) {
        setError(result.error as ServerError);
        return;
      }

      if (!result.data) {
        setError(new ServerError(ErrorCodes.INVALID_INSTANCE));
        return;
      }

      setPaymentGateways(result.data);
    } catch (err) {
      console.error(err);
      if (err instanceof ServerError) {
        setError(err);
      } else {
        setError(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPaymentGateways();
  }, []);

  return (
    <PaymentGatewayContext.Provider
      value={{
        paymentGateways,
        loading,
        error,
        refreshPaymentGateways: fetchPaymentGateways
      }}
    >
      {children}
    </PaymentGatewayContext.Provider>
  );
}

export function usePaymentGateway() {
  return React.useContext(PaymentGatewayContext);
}