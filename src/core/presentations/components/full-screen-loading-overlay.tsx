// src/core/presentations/components/fullscreen-loading-overlay.tsx
import React from "react";
import { Spinner } from "@/core/presentations/components/spinner";

type FullscreenLoadingOverlayProps = {
  isVisible: boolean;
};

export function FullscreenLoadingOverlay({ isVisible }: FullscreenLoadingOverlayProps) {
  if (!isVisible) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-3">
        <Spinner />
      </div>
    </div>
  );
}
