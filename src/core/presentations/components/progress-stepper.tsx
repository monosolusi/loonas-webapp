import React from "react";
import { CheckIcon } from "@heroicons/react/24/solid";

export type StepStatus = "current" | "completed" | "upcoming";

export interface ProgressStepperItem {
  id: string;
  label: string;
  status: StepStatus;
}

interface ProgressStepperProps {
  data: ProgressStepperItem[];
}

const STATUS_COLOR: Record<StepStatus, string> = {
  current: "border-2 border-primary-default",
  completed: "bg-primary-default group-hover:bg-primary-800",
  upcoming: "border-2 border-gray-300 group-hover:border-gray-400"
};

export function ProgressStepper(props: ProgressStepperProps) {

  return (
    <nav>
      <ol
        role="list"
        className="divide-y divide-gray-300 bg-white rounded-md border border-gray-300 md:flex md:divide-y-0"
      >
        {props.data.map((item, index) => (
          <li
            key={item.id}
            className="relative md:flex md:flex-1"
          >
            <div className="group flex items-center">
              <div className="flex items-center px-6 py-4 text-sm font-medium">
                <div
                  className={`flex size-10 shrink-0 items-center justify-center rounded-full border-2 ${STATUS_COLOR[item.status]}`}
                >
                  {item.status !== "completed" && (
                    <div className="text-gray-500 group-hover:text-gray-900">
                      {(index + 1).toString().padStart(2, "0")}
                    </div>
                  )}

                  {item.status === "completed" && (
                    <CheckIcon aria-hidden="true" className="size-6 text-white" />
                  )}
                </div>
                <div
                  className={`ml-4 text-sm font-medium ${item.status === "current" ? "text-primary-default" : "text-gray-500"} group-hover:text-gray-900"`}
                >
                  {item.label}
                </div>
              </div>
            </div>

            {index < props.data.length - 1 && (
              <div aria-hidden="true" className="absolute top-0 right-0 hidden h-full w-5 md:block">
                <svg fill="none" viewBox="0 0 22 80" preserveAspectRatio="none"
                     className="size-full text-gray-300">
                  <path
                    d="M0 -2L20 40L0 82"
                    stroke="currentcolor"
                    vectorEffect="non-scaling-stroke"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            )}

          </li>
        ))}
      </ol>
    </nav>
  );
}
