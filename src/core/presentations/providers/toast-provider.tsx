"use client";

import { createContext, useCallback, useState } from "react";
import clsx from "clsx";
import {
  InformationCircleIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationCircleIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";

type ToastType = "info" | "success" | "error" | "warning";

type Toast = {
  id: string;
  title: string;
  description?: string;
  type: ToastType;
  dismissible: boolean;
};

type ShowToastOptions = {
  title: string;
  description?: string;
  type?: ToastType;
  dismissible?: boolean;
};

type ToastContextValue = {
  showToast: (titleOrOptions: string | ShowToastOptions, type?: ToastType) => void;
};

export const ToastContext = createContext<ToastContextValue | null>(null);

const TOAST_DURATION = 4000;

const TOAST_CONFIG: Record<ToastType, { icon: typeof InformationCircleIcon; iconClass: string; titleClass: string }> = {
  info: {
    icon: InformationCircleIcon,
    iconClass: "text-primary-300",
    titleClass: "text-primary-300",
  },
  success: {
    icon: CheckCircleIcon,
    iconClass: "text-success-300",
    titleClass: "text-success-300",
  },
  error: {
    icon: XCircleIcon,
    iconClass: "text-error-300",
    titleClass: "text-error-300",
  },
  warning: {
    icon: ExclamationCircleIcon,
    iconClass: "text-warning-300",
    titleClass: "text-warning-300",
  },
};

type ToastProviderProps = {
  children: React.ReactNode;
};

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((titleOrOptions: string | ShowToastOptions, type?: ToastType) => {
    const id = crypto.randomUUID();
    const dismissible =
      typeof titleOrOptions === "string" ? false : (titleOrOptions.dismissible ?? false);
    const toast: Toast =
      typeof titleOrOptions === "string"
        ? { id, title: titleOrOptions, type: type ?? "success", dismissible }
        : { id, title: titleOrOptions.title, description: titleOrOptions.description, type: titleOrOptions.type ?? "success", dismissible };

    setToasts((prev) => [...prev, toast]);
    if (!dismissible) {
      setTimeout(() => dismiss(id), TOAST_DURATION);
    }
  }, [dismiss]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-6 left-6 z-50 flex flex-col-reverse gap-y-3">
        {toasts.map((toast) => {
          const config = TOAST_CONFIG[toast.type];
          const Icon = config.icon;

          return (
            <div
              key={toast.id}
              className="animate-slide-in-left flex w-[360px] items-start gap-x-3 rounded-xl border border-neutral-100 bg-white px-4 py-3.5 shadow-lg"
            >
              <Icon className={clsx("mt-0.5 size-5 shrink-0", config.iconClass)} />
              <div className="flex min-w-0 flex-1 flex-col gap-y-0.5">
                <span className={clsx("text-sm font-semibold", config.titleClass)}>{toast.title}</span>
                {toast.description && (
                  <span className="text-sm text-neutral-300">{toast.description}</span>
                )}
              </div>
              {toast.dismissible && (
                <button
                  type="button"
                  onClick={() => dismiss(toast.id)}
                  className="shrink-0 p-0.5 text-neutral-200 transition-colors hover:text-neutral-400"
                >
                  <XMarkIcon className="size-5" />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
