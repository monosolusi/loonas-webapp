import { ServerError } from "@/core/resources/server-error";

type IdleState = { loading: false; success: false; error: null };
type LoadingState = { loading: true; success: false; error: null };
type SuccessState = { loading: false; success: true; error: null };
type ErrorState = { loading: false; success: false; error: ServerError };

export type UseSendPasswordResetEmailReturnType = {
  state: IdleState | LoadingState | SuccessState | ErrorState;
  submit: (email: string) => void;
  cooldownSeconds: number;
};
