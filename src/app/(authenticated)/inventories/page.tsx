"use client";

import ComingSoon from "@/core/presentations/static-files/coming-soon.json";
import { PageContent } from "@/core/presentations/components/page-content";
import dynamic from "next/dynamic";

const Player = dynamic(() => import("@lottiefiles/react-lottie-player").then((mod) => ({ default: mod.Player })), {
  ssr: false,
});

export default function InventoriesPage() {
  return (
    <PageContent>
      <div className="flex flex-col items-center justify-center">
        <div className="h-[200px] w-auto">
          <Player src={ComingSoon} autoplay loop />
        </div>
      </div>
    </PageContent>
  );
}
