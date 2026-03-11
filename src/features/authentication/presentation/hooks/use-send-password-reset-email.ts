"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { isValidEmail } from "@/core/utilities/validation-patterns";
import { UseSendPasswordResetEmailReturnType } from "@/features/authentication/presentation/hooks/use-send-password-reset-email.types";
import { AuthServiceImpl } from "@/features/authentication/data/sources/auth";
import { AuthRepositoryImpl } from "@/features/authentication/data/repositories/auth";
import {
  SendPasswordResetEmailUseCase,
  SendPasswordResetEmailUseCaseParams,
} from "@/features/authentication/domain/usecases/send-password-reset-email";
import { DataFailed } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";

const COOLDOWN_DURATION = 30;

export function useSendPasswordResetEmail(): UseSendPasswordResetEmailReturnType {
  const [state, setState] = useState<UseSendPasswordResetEmailReturnType["state"]>({
    loading: false,
    success: false,
    error: null,
  });
  const [cooldownSeconds, setCooldownSeconds] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (cooldownSeconds <= 0) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = setInterval(() => {
      setCooldownSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          intervalRef.current = null;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [cooldownSeconds]);

  const submit = useCallback(
    async (email: string) => {
      if (state.loading || cooldownSeconds > 0) return;
      if (!email || !isValidEmail(email)) return;

      setState({ loading: true, success: false, error: null });

      try {
        const authService = new AuthServiceImpl();
        const authRepository = new AuthRepositoryImpl(authService);
        const useCase = new SendPasswordResetEmailUseCase(authRepository);
        const result = await useCase.execute(new SendPasswordResetEmailUseCaseParams(email));

        if (result instanceof DataFailed) {
          setState({ loading: false, success: false, error: result.error as ServerError });
          return;
        }

        setState({ loading: false, success: true, error: null });
        setCooldownSeconds(COOLDOWN_DURATION);
      } catch (err) {
        setState({
          loading: false,
          success: false,
          error: err instanceof ServerError ? err : new ServerError(ErrorCodes.UNKNOWN),
        });
      }
    },
    [state.loading, cooldownSeconds],
  );

  return { state, submit, cooldownSeconds };
}
