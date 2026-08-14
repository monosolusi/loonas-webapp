"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { isValidEmail, isValidPassword } from "@/core/utilities/validation-patterns";
import { withTimeout } from "@/core/utilities/with-timeout";
import { useGetMe } from "@/features/user/presentation/hooks/use-get-me";
import { useAuth, useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { SubmitStatus } from "@/app/(user)/onboarding/user/_utils/submit-status";
import {
  EMAIL_VERIFICATION_REQUIRED_MESSAGE,
  GENERIC_ERROR_MESSAGE,
  SET_ACTIVE_FAILED_AFTER_CREATE_MESSAGE,
  SubmitError,
  classifySubmitError,
} from "@/app/(user)/onboarding/user/_utils/classify-submit-error";

// Only `setActive()` is bounded by this — by the time it runs, `signUp.create()` has already
// returned `complete` and the account is known-created, so a false timeout rejection here is
// SAFE: the recovery copy ("account exists, session failed, reload and sign in") is correct
// regardless of whether Clerk actually failed or just never responded in time. `signUp.create()`
// itself is awaited directly with no timeout — see `createSession()` below for why.
const SET_ACTIVE_TIMEOUT_MS = 60_000;

type CreateUserContextProps = {
  email: string;
  password: string;
  repeatPassword: string;
  isClean: boolean;
  status: SubmitStatus;
  isReady: boolean;
  isSignedIn: boolean;
  error: SubmitError | null;
  emailError: string | null;
  passwordError: string | null;
  repeatPasswordError: string | null;
  setEmail?: React.Dispatch<React.SetStateAction<string>>;
  setPassword?: React.Dispatch<React.SetStateAction<string>>;
  setRepeatPassword?: React.Dispatch<React.SetStateAction<string>>;
  submit?: () => Promise<void>;
};

type CreateUserProviderProps = {
  children: React.ReactNode;
  // Provider guarantee pattern (extended): rendered instead of `children` while a signed-in user
  // is being bounced off this page on mount — avoids a flash of the live-but-disabled form.
  redirecting: React.ReactNode;
};

const CreateUserContext = React.createContext<CreateUserContextProps>({
  email: "",
  password: "",
  repeatPassword: "",
  isClean: true,
  status: "idle",
  isReady: false,
  isSignedIn: false,
  error: null,
  emailError: null,
  passwordError: null,
  repeatPasswordError: null,
});

export function CreateUserProvider(props: CreateUserProviderProps) {
  const [email, setEmail] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const [repeatPassword, setRepeatPassword] = React.useState<string>("");
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [error, setError] = useState<SubmitError | null>(null);
  // Caches the session created by `signUp.create()` so a retry after a failed `setActive()`
  // re-attempts only `setActive()` — never calls `signUp.create()` twice for the same account
  // (mirrors `createdAccountId` in the sibling account-creation hooks).
  //
  // The credentials that produced the session are stored WITH it, and `createSession()` reuses the
  // cache only on an exact match. The fields are editable again once `status` is "failed", so a
  // bare id would let an edit-then-resubmit activate the account created from the PREVIOUS input
  // while the form displays the new one — "displayed value and saved value must be the same
  // expression", applied to account identity. Pairing them makes that drift structurally
  // impossible rather than something an invalidation effect has to remember to catch.
  const [createdSession, setCreatedSession] = useState<{ id: string; email: string; password: string } | null>(null);
  const { isLoaded, signUp, setActive } = useSignUp();
  const { isSignedIn } = useAuth();
  const { loading: isLoadingMe } = useGetMe();
  const router = useRouter();

  const hasRedirectedForExistingSession = useRef(false);
  const hasNavigatedAfterSuccess = useRef(false);

  const emailError = useMemo(() => {
    if (email) return isValidEmail(email) ? null : "Email tidak valid";
    return null;
  }, [email]);

  const passwordError = useMemo(() => {
    if (!password) return null;
    return isValidPassword(password) ? null : "Kata sandi harus mengandung huruf besar, kecil, angka dan simbol";
  }, [password]);

  const repeatPasswordError = useMemo(() => {
    if (!repeatPassword) return null;
    return password === repeatPassword ? null : "Kata sandi tidak cocok";
  }, [password, repeatPassword]);

  const isClean = useMemo(
    () => isValidEmail(email) && isValidPassword(password) && password === repeatPassword,
    [email, password, repeatPassword],
  );

  // Single source of truth for "ready to submit" — derived from the same `useSignUp()` instance
  // `submit()` uses below, plus the `useGetMe()` loading flag. Consumers (e.g. the submit
  // button) must read this instead of calling `useAuth().isLoaded` themselves, which can resolve
  // at a different time and disagree with this provider.
  const isReady = useMemo(() => isLoaded && !isLoadingMe, [isLoaded, isLoadingMe]);

  // A signed-in user landing here (e.g. refreshing after a silent-looking success) always goes to
  // `/home`, never `/onboarding/account` here — `(authenticated)` → `ProtectedPage` →
  // `SelectedAccountProvider` already owns "signed-in user with zero accounts → onboarding/account",
  // and re-deriving that rule at this call site would be exactly the drift CLAUDE.md warns
  // against. Matches the destination the pre-rewrite already-signed-in path used. Only fires from
  // "idle" — never races the post-signup navigation below.
  const isBouncingToExistingSession = status === "idle" && isReady && isSignedIn;

  useEffect(() => {
    if (!isBouncingToExistingSession) return;
    if (hasRedirectedForExistingSession.current) return;
    hasRedirectedForExistingSession.current = true;
    router.replace("/home");
  }, [isBouncingToExistingSession, router]);

  // Belt-and-braces fallback: `setActive({ redirectUrl })` owns navigation on the happy path, but
  // if that redirect is ever dropped, this still gets the user to step 2 once the session is
  // confirmed active rather than leaving them on a "Berhasil, mengalihkan..." button forever.
  useEffect(() => {
    if (status !== "succeeded") return;
    if (hasNavigatedAfterSuccess.current) return;
    hasNavigatedAfterSuccess.current = true;
    router.replace("/onboarding/account");
  }, [status, router]);

  async function createSession(): Promise<string | null> {
    if (createdSession && createdSession.email === email && createdSession.password === password) {
      return createdSession.id;
    }

    // Awaited directly — no client-side race/timeout. Racing this against a timer would let it
    // keep resolving server-side after we've already told the user it failed, so a resubmit then
    // collides with `form_identifier_exists` on an account that silently already exists. A
    // genuinely long wait is instead surfaced by `CreateUserStatusNotice` reading elapsed time, not
    // by cutting this promise off.
    const resource = await signUp!.create({ emailAddress: email, password });

    if (resource.status !== "complete") {
      const requiresEmailVerification =
        resource.status === "missing_requirements" &&
        resource.unverifiedFields.includes("email_address") &&
        resource.missingFields.length === 0;

      setError({
        kind: "error",
        message: requiresEmailVerification ? EMAIL_VERIFICATION_REQUIRED_MESSAGE : GENERIC_ERROR_MESSAGE,
      });
      if (!requiresEmailVerification) console.error("[create-user] unexpected sign-up status", resource.status);
      return null;
    }

    if (!resource.createdSessionId) {
      console.error("[create-user] sign-up completed without a session id");
      setError({ kind: "error", message: GENERIC_ERROR_MESSAGE });
      return null;
    }

    setCreatedSession({ id: resource.createdSessionId, email, password });
    return resource.createdSessionId;
  }

  async function activateSession(sessionId: string): Promise<boolean> {
    try {
      await withTimeout(
        () => setActive!({ session: sessionId, redirectUrl: "/onboarding/account" }),
        SET_ACTIVE_TIMEOUT_MS,
      );
      return true;
    } catch (err) {
      // The account was already created successfully at this point — never say "pembuatan akun
      // gagal" here, that would be a lie and would push the user into a duplicate sign-up. Same
      // copy whether this is a real Clerk failure or the `withTimeout` deadline — the correct
      // recovery action ("reload and sign in") is identical either way, so this catch never needs
      // to distinguish them or route through `classifySubmitError`.
      console.error(err);
      setError({ kind: "error", message: SET_ACTIVE_FAILED_AFTER_CREATE_MESSAGE });
      return false;
    }
  }

  async function submit(): Promise<void> {
    // Defensive guards mirroring what already disables the button — `submit` must still never
    // throw or misbehave if called directly.
    if (status === "submitting" || status === "succeeded") return;
    if (isSignedIn || !isReady || !isClean) return;

    setStatus("submitting");
    setError(null);

    // `isReady` guarantees `isLoaded`, which per Clerk's discriminated `useSignUp()` return type
    // guarantees `signUp`/`setActive` — TypeScript just can't see that correlation through the
    // `isReady` memo. This check should be unreachable; it only guards the non-null assertions
    // below without silently leaving the user stuck if it somehow isn't.
    if (!signUp || !setActive) {
      setError({ kind: "error", message: GENERIC_ERROR_MESSAGE });
      setStatus("failed");
      return;
    }

    try {
      const sessionId = await createSession();
      if (sessionId === null) {
        setStatus("failed");
        return;
      }

      const activated = await activateSession(sessionId);
      if (!activated) {
        setStatus("failed");
        return;
      }

      setStatus("succeeded");
    } catch (err) {
      console.error(err);
      const outcome = classifySubmitError(err);

      if (outcome.kind === "redirect-signed-in") {
        // Consume the post-success navigation guard BEFORE entering "succeeded", or the effect
        // above also fires and replaces to /onboarding/account — two competing navigations to
        // different destinations. This path is "you were already signed in", so /home wins, and
        // "succeeded" here only keeps the button spinning while we navigate away.
        hasNavigatedAfterSuccess.current = true;
        setStatus("succeeded");
        router.replace("/home");
        return;
      }

      setError(outcome);
      setStatus("failed");
    }
  }

  return (
    <CreateUserContext.Provider
      value={{
        email,
        setEmail,
        password,
        setPassword,
        repeatPassword,
        setRepeatPassword,
        isClean,
        emailError,
        passwordError,
        repeatPasswordError,
        submit,
        status,
        error,
        isReady,
        isSignedIn: !!isSignedIn,
      }}
    >
      {isBouncingToExistingSession ? props.redirecting : props.children}
    </CreateUserContext.Provider>
  );
}

export function useCreateUser() {
  return React.useContext(CreateUserContext);
}
