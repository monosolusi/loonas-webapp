"use client";

import { XCircleIcon } from "@heroicons/react/20/solid";
import { useCreateBusinessAccountState } from "@/features/account/presentation/providers/create-business-account";

export function InputErrorAlert() {
  const { errorList } = useCreateBusinessAccountState();

  if (errorList.length === 0) return null;
  return (
    <div className="w-full sm:mx-auto">
      <div className="rounded-md bg-red-50 p-4">
        <div className="flex">
          <div className="shrink-0">
            <XCircleIcon aria-hidden="true" className="size-5 text-red-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm text-red-800">Sepertinya ada kesalahan saat mengisi form. Coba dicek lagi, ya?</h3>
            <div className="mt-2 text-sm text-red-700">
              <ul role="list" className="list-disc space-y-1 pl-5">
                {errorList.map((error, index) => (
                  <li key={`err-${index}`}>{error.message}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
