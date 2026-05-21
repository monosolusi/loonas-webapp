"use client";

import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { EllipsisVerticalIcon } from "@heroicons/react/16/solid";
import clsx from "clsx";

export type ActionMenuOption = {
  label: string;
  onClick: () => void;
  variant?: "default" | "danger";
};

type ActionMenuProps = {
  options: ActionMenuOption[];
};

export function ActionMenu({ options }: ActionMenuProps) {
  return (
    <Menu as="div" className="relative">
      <MenuButton
        onClick={(e: React.MouseEvent) => e.preventDefault()}
        className="flex size-11 items-center justify-center rounded-lg text-neutral-200 transition-colors hover:bg-neutral-50 hover:text-neutral-400 focus:outline-none"
      >
        <EllipsisVerticalIcon className="size-4" />
      </MenuButton>
      <MenuItems
        anchor="bottom end"
        className="z-10 w-44 rounded-lg border border-neutral-100 bg-white py-1 shadow-lg focus:outline-none"
      >
        {options.map((option) => (
          <MenuItem key={option.label}>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                option.onClick();
              }}
              className={clsx(
                "flex w-full cursor-pointer px-3 py-2 text-left text-sm data-[focus]:bg-neutral-100/20",
                option.variant === "danger" ? "text-error-300 data-[focus]:bg-red-50" : "text-neutral-500",
              )}
            >
              {option.label}
            </button>
          </MenuItem>
        ))}
      </MenuItems>
    </Menu>
  );
}
