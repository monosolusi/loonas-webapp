import { LogoImage } from "@/core/presentations/components/logo-image";
import { NavigationMenu } from "@/app/(authenticated)/_components/navigation-menu";

export function NavigationBar() {
  return (
    <nav className="bg-background hidden h-full w-[256px] shrink-0 flex-col gap-y-8 border-r border-r-neutral-200 p-6 lg:flex">
      <LogoImage className="h-auto w-24" />
      <NavigationMenu />
      <div className="flex text-xs leading-4 text-neutral-300">Loonas</div>
    </nav>
  );
}
