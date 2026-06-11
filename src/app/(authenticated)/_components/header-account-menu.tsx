import Image from "next/image";
import Link from "next/link";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { HeaderUserEmail } from "@/app/(authenticated)/_components/header-user-email";
import { HeaderSignOutMenu } from "@/app/(authenticated)/_components/header-sign-out-menu";
import { HeaderAccountName } from "@/app/(authenticated)/_components/header-account-name";
import { HeaderAccountList } from "@/app/(authenticated)/_components/header-account-list";
import { HeaderAvatar } from "@/app/(authenticated)/_components/header-avatar";

export function HeaderAccountMenu() {
  return (
    <Menu>
      <MenuButton className="flex flex-row items-center gap-x-3 px-3 py-2 focus:not-data-focus:outline-none">
        <div className="flex flex-col">
          <HeaderAccountName />
          <HeaderUserEmail />
        </div>
        <HeaderAvatar />
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
          <HeaderAccountList />

          {/*  Divider */}
          <div className="px-1">
            <div className="h-[1px] w-full bg-neutral-200/50"></div>
          </div>

          {/*  Settings Section */}
          <div className="flex flex-col gap-y-1 p-2">
            <Link href="/settings">
              <MenuItem
                as="div"
                className="flex cursor-pointer flex-row items-center gap-x-2 p-3 text-neutral-300 hover:rounded-lg hover:text-neutral-500"
              >
                <Image
                  src="/assets/images/gear-icon-neutral-300-w16-h16.svg"
                  alt="Settings Icon"
                  width={16}
                  height={16}
                />
                <div className="text-sm leading-4 font-semibold">Pengaturan</div>
              </MenuItem>
            </Link>
            <Link href="/accounts">
              <MenuItem
                as="div"
                className="flex cursor-pointer flex-row items-center gap-x-2 p-3 text-neutral-300 hover:rounded-lg hover:text-neutral-500"
              >
                <Image
                  src="/assets/images/people-icon-neutral-300-w16-h16.svg"
                  alt="Account Icon"
                  width={16}
                  height={16}
                />
                <div className="text-sm leading-4 font-semibold">Manajemen Akun</div>
              </MenuItem>
            </Link>
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
