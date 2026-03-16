"use client";

import { createContext, useCallback, useState } from "react";
import clsx from "clsx";

type ToastType = "success" | "error";

type Toast = {
  id: string;
  message: string;
  type: ToastType;
};

type ToastContextValue = {
  showToast: (message: string, type?: ToastType) => void;
};

export const ToastContext = createContext<ToastContextValue | null>(null);

const TOAST_DURATION = 3000;

type ToastProviderProps = {
  children: React.ReactNode;
};

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = "success") => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, TOAST_DURATION);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed right-6 bottom-6 z-50 flex flex-col gap-y-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={clsx(
              "animate-slide-in-right rounded-lg px-4 py-3 text-sm font-medium shadow-lg",
              toast.type === "success" && "bg-primary-300 text-white",
              toast.type === "error" && "bg-error-300 text-white",
            )}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
