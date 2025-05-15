import React from "react";
import PaperPlaneAnimation from "../_static-files/paper-plane-animation.json";
import { Card } from "@/core/presentations/components/card";
import { Player } from "@lottiefiles/react-lottie-player";

interface CurrentStatusProps {
  title: string;
  description: string;
}

export function CurrentStatus(props: CurrentStatusProps) {
  return (
    <Card>
      <div className="flex justify-center mb-4">
        <div className="h-35 w-36">
          <Player autoplay loop src={PaperPlaneAnimation} />
        </div>
      </div>
      <div className="text-center">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">{props.title}</h2>
        <p className="text-gray-600">{props.description}</p>
      </div>
    </Card>
  );
}