"use client";

import { NavigationGroup } from "@/app/(authenticated)/_components/navigation-group";
import { NavigationChildItem } from "@/app/(authenticated)/_components/navigation-child-item";

type InventoryNavGroupProps = {
  id: string;
  openGroup: string | null;
  onOpenChange: (id: string) => void;
};

export function InventoryNavGroup({ id, openGroup, onOpenChange }: InventoryNavGroupProps) {
  return (
    <NavigationGroup
      id={id}
      label="Inventaris"
      iconPath="/assets/images/box-icon-neutral-300-w16-h16.svg"
      selectedIconPath="/assets/images/box-icon-primary-300-w16-h16.svg"
      matchPrefixes={["/inventory"]}
      openGroup={openGroup}
      onOpenChange={onOpenChange}
    >
      <NavigationChildItem href="/inventory/negative-stock" label="Stok Negatif" />
    </NavigationGroup>
  );
}