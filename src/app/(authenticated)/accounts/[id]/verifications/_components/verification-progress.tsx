"use client";

import React from "react";
import { CheckIcon } from "@heroicons/react/24/solid";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { useAccountVerificationWork } from "@/features/account/presentation/providers/account-verification-work";
import { VerificationStatus } from "@/features/account/domain/enums/verification-status";


const steps = [
  {
    orderNumber: "01",
    id: "NEW",
    name: "Berkas Diterima",
    description: "Berkasmu sudah diterima."
  },
  {
    orderNumber: "02",
    id: "PROCESSING",
    name: "Verifikasi Berlangsung",
    description: "Tim Loonas sedang memverifikasi akunmu."
  },
  {
    orderNumber: "03",
    id: "COMPLETED",
    name: "Selesai",
    description: "Diperkirakan selesai."
  }
];


function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

export function VerificationProgress() {
  const [accountVerificationWork] = useAccountVerificationWork();

  function generateDescription(stepId: string) {
    const step = steps.find((step) => step.id === stepId);
    if (!step) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

    if (!accountVerificationWork) return step.description;
    if (stepId === "COMPLETED") {
      const formattedCompleteDate = accountVerificationWork.estimatedVerificationComplete.toFormat("dd MMMM yyyy");
      return `${step.description} ${formattedCompleteDate}`;
    }

    return step.description;
  }

  function inferStepStatus(stepId: string) {
    const step = steps.find((step) => step.id === stepId);
    if (!step) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

    if (!accountVerificationWork) return "upcoming";
    const latestStatus = accountVerificationWork.latestStatus;

    if (stepId === latestStatus) return "current";
    if (stepId === VerificationStatus.NEW && latestStatus !== VerificationStatus.NEW) return "completed";
    return "upcoming"; // All other cases: "upcoming"
  }

  return (
    <div className="lg:border-t lg:border-b lg:border-gray-200">
      <nav aria-label="Progress" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ol
          role="list"
          className="overflow-hidden rounded-md lg:flex lg:rounded-none lg:border-r lg:border-l lg:border-gray-200"
        >
          {steps.map((step, stepIdx) => (
            <li key={step.id} className="relative overflow-hidden lg:flex-1">
              <div
                className={classNames(
                  stepIdx === 0 ? "rounded-t-md border-b-0" : "",
                  stepIdx === steps.length - 1 ? "rounded-b-md border-t-0" : "",
                  "overflow-hidden border border-gray-200 lg:border-0"
                )}
              >
                {inferStepStatus(step.id) === "completed" ? (
                  <div className="group">
                    <span
                      aria-hidden="true"
                      className="absolute top-0 left-0 h-full w-1 bg-transparent group-hover:bg-gray-200 lg:top-auto lg:bottom-0 lg:h-1 lg:w-full"
                    />
                    <span
                      className={classNames(
                        stepIdx !== 0 ? "lg:pl-9" : "",
                        "flex items-start px-6 py-5 text-sm font-medium"
                      )}
                    >
                      <span className="shrink-0">
                        <span className="flex size-10 items-center justify-center rounded-full bg-primary-default">
                          <CheckIcon aria-hidden="true" className="size-6 text-white" />
                        </span>
                      </span>
                      <span className="mt-0.5 ml-4 flex min-w-0 flex-col">
                        <span className="text-sm font-medium">{step.name}</span>
                        <span className="text-sm font-medium text-gray-500">{generateDescription(step.id)}</span>
                      </span>
                    </span>
                  </div>
                ) : inferStepStatus(step.id) === "current" ? (
                  <div aria-current="step">
                    <span
                      aria-hidden="true"
                      className="absolute top-0 left-0 h-full w-1 bg-primary-default lg:top-auto lg:bottom-0 lg:h-1 lg:w-full"
                    />
                    <span
                      className={classNames(
                        stepIdx !== 0 ? "lg:pl-9" : "",
                        "flex items-start px-6 py-5 text-sm font-medium"
                      )}
                    >
                      <span className="shrink-0">
                        <span
                          className="flex size-10 items-center justify-center rounded-full border-2 border-primary-default">
                          <span className="text-primary-default">{step.orderNumber}</span>
                        </span>
                      </span>
                      <span className="mt-0.5 ml-4 flex min-w-0 flex-col">
                        <span className="text-sm font-medium text-primary-default">{step.name}</span>
                        <span className="text-sm font-medium text-gray-500">{generateDescription(step.id)}</span>
                      </span>
                    </span>
                  </div>
                ) : (
                  <div className="group">
                    <span
                      aria-hidden="true"
                      className="absolute top-0 left-0 h-full w-1 bg-transparent group-hover:bg-gray-200 lg:top-auto lg:bottom-0 lg:h-1 lg:w-full"
                    />
                    <span
                      className={classNames(
                        stepIdx !== 0 ? "lg:pl-9" : "",
                        "flex items-start px-6 py-5 text-sm font-medium"
                      )}
                    >
                      <span className="shrink-0">
                        <span
                          className="flex size-10 items-center justify-center rounded-full border-2 border-gray-300">
                          <span className="text-gray-500">{step.orderNumber}</span>
                        </span>
                      </span>
                      <span className="mt-0.5 ml-4 flex min-w-0 flex-col">
                        <span className="text-sm font-medium text-gray-500">{step.name}</span>
                        <span className="text-sm font-medium text-gray-500">{generateDescription(step.id)}</span>
                      </span>
                    </span>
                  </div>
                )}

                {stepIdx !== 0 ? (
                  <>
                    {/* Separator */}
                    <div aria-hidden="true" className="absolute inset-0 top-0 left-0 hidden w-3 lg:block">
                      <svg
                        fill="none"
                        viewBox="0 0 12 82"
                        preserveAspectRatio="none"
                        className="size-full text-gray-300"
                      >
                        <path d="M0.5 0V31L10.5 41L0.5 51V82" stroke="currentcolor"
                              vectorEffect="non-scaling-stroke" />
                      </svg>
                    </div>
                  </>
                ) : null}
              </div>
            </li>
          ))}
        </ol>
      </nav>
    </div>);
}