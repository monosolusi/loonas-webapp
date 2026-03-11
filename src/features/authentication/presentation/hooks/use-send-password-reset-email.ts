"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { isValidEmail } from "@/core/utilities/validation-patterns";
import { UseSendPasswordResetEmailReturnType } from "@/features/authentication/presentation/hooks/use-send-password-reset-email.types";

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
    (email: string) => {
      if (state.loading || cooldownSeconds > 0) return;
      if (!email || !isValidEmail(email)) return;

      setState({ loading: true, success: false, error: null });

      // TODO: Wire to SendPasswordResetEmailUseCase
      // const useCase = new SendPasswordResetEmailUseCase(new AuthRepositoryImpl(new AuthServiceImpl()));
      // const result = await useCase.execute(email);
      setTimeout(() => {
        setState({ loading: false, success: true, error: null });
        setCooldownSeconds(COOLDOWN_DURATION);
      }, 1500);
    },
    [state.loading, cooldownSeconds],
  );

  return { state, submit, cooldownSeconds };
}
