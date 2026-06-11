"use client";

import { Popover, PopoverButton, PopoverPanel, Transition } from "@headlessui/react";
import { Fragment } from "react";
import Image from "next/image";
import { useGetNotifications } from "@/features/notification/presentations/hooks/use-get-notifications";
import { NotificationList } from "@/features/notification/presentations/components/notification-list";

export function NotificationBell() {
  const { notifications, count } = useGetNotifications();

  return (
    <Popover className="relative">
      <PopoverButton className="flex size-10 flex-col items-center justify-center outline-none">
        <div className="relative">
          <Image src="/assets/images/bell-icon-neutral-300-w16-h16.svg" alt="bell icon" width={16} height={16} />
          {count > 0 && (
            <div className="bg-error-300 absolute -top-2.5 -right-2.5 flex size-4 items-center justify-center rounded-full border-2 border-white">
              <span className="text-[10px] font-medium text-white">{count > 9 ? "9+" : count}</span>
            </div>
          )}
        </div>
      </PopoverButton>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-200"
        enterFrom="opacity-0 translate-y-1"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in duration-150"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-1"
      >
        <PopoverPanel className="absolute right-0 z-10 mt-2 w-[360px] rounded-lg border border-neutral-200 bg-white shadow-lg">
          <div className="border-b border-neutral-100 px-4 py-3">
            <h3 className="text-sm font-semibold text-neutral-500">Notifikasi</h3>
          </div>
          <div className="max-h-[400px] overflow-y-auto p-3">
            <NotificationList notifications={notifications} />
          </div>
        </PopoverPanel>
      </Transition>
    </Popover>
  );
}
