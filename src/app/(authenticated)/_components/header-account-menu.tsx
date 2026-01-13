import Image from "next/image";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { HeaderUserEmail } from "@/app/(authenticated)/_components/header-user-email";
import { HeaderSignOutMenu } from "@/app/(authenticated)/_components/header-sign-out-menu";
import { HeaderAccountName } from "@/app/(authenticated)/_components/header-account-name";

export function HeaderAccountMenu() {
  return (
    <Menu>
      <MenuButton className="flex flex-row items-center gap-x-3 px-3 py-2 focus:not-data-focus:outline-none">
        <div className="flex flex-col">
          <HeaderAccountName />
          <HeaderUserEmail />
        </div>
        <div className="border-primary-300/20 bg-primary-300/10 size-10 rounded-full"></div>
        <div className="size-4">
          <Image
            src="/assets/images/arrow-down-icon-neutral-300-w16-h16.svg"
            alt="arrow down icon"
            width={16}
            height={16}
          />
        </div>
      </MenuButton>
      <MenuItems
        anchor="bottom end"
        className="rounded-lg border border-neutral-200 bg-white/95 transition duration-100 ease-out focus:outline-none data-closed:opacity-0"
        transition
      >
        <div className="flex w-[320px] flex-col gap-y-2">
          {/* Account List - Switch Account Section */}
          <div className="flex flex-col gap-y-1 p-2">
            <div className="p-2 text-xs leading-4 font-semibold tracking-tight text-neutral-300 uppercase">
              Switch Account
            </div>

            <MenuItem as="div" className="flex cursor-pointer flex-row items-center gap-x-3 p-3">
              <div className="bg-primary-300/10 border-primary-300/20 text-primary-300 flex size-8 flex-col items-center justify-center rounded-full border text-xs leading-4 font-bold"></div>
              <div className="flex flex-col">
                <div className="text-sm leading-4 font-semibold">Budi Santoso</div>
                <div className="text-xs leading-4 font-normal text-neutral-300 capitalize">Akun Personal</div>
              </div>
            </MenuItem>

            <MenuItem as="div" className="flex cursor-pointer flex-row items-center gap-x-3 p-3">
              <div className="bg-success-300/10 border-success-300/20 text-success-300 flex size-8 flex-col items-center justify-center rounded-full border text-xs leading-4 font-bold"></div>
              <div className="flex flex-col">
                <div className="text-sm leading-4 font-semibold">PT Maju Jaya</div>
                <div className="text-xs leading-4 font-normal text-neutral-300 capitalize">Akun Bisnis</div>
              </div>
            </MenuItem>
            <MenuItem
              as="div"
              className="hover hover:bg-primary-300/5 flex cursor-pointer flex-row items-center gap-x-3 rounded-lg p-3"
            >
              <div className="bg-primary-300/10 border-primary-300/20 text-primary-300 flex size-8 flex-col items-center justify-center rounded-full border">
                <Image src="/assets/images/plus-icon-neutral-300-w16-h16.svg" alt="Plus Icon" width={16} height={16} />
              </div>
              <div className="flex flex-col">
                <div className="text-primary-300 text-sm leading-4 font-medium">Tambah Akun Baru</div>
              </div>
            </MenuItem>
          </div>

          {/*  Divider */}
          <div className="px-1">
            <div className="h-[1px] w-full bg-neutral-200/50"></div>
          </div>

          {/*  Settings Section */}
          <div className="flex flex-col gap-y-1 p-2">
            <MenuItem
              as="div"
              className="flex cursor-pointer flex-row items-center gap-x-2 p-3 text-neutral-300 hover:rounded-lg hover:text-neutral-500"
            >
              <Image src="/assets/images/people-icon-neutral-300-w16-h16.svg" alt="Gear Icon" width={16} height={16} />
              <div className="text-sm leading-4 font-semibold">Manajemen Akun</div>
            </MenuItem>
          </div>

          {/*  Divider */}
          <div className="px-1">
            <div className="h-[1px] w-full bg-neutral-200/50"></div>
          </div>

          <div className="flex flex-col gap-y-1 p-2">
            <HeaderSignOutMenu />
          </div>
        </div>
      </MenuItems>
    </Menu>
  );
}
