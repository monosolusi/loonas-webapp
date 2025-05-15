import React from "react";
import { Card } from "@/core/presentations/components/card";
import { PaymentRequestStatus } from "@/features/invoice/domain/enums/payment-request";
import { CheckIcon } from "@heroicons/react/20/solid";


interface TimelineProps {
  items: {
    id: string | number;
    content: string;
    status: PaymentRequestStatus;
    icon: any,
    iconBackground: string
  }[];
  currentStatus: PaymentRequestStatus;
}

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

export function Timeline(props: TimelineProps) {
  /**
   * Determines the status of a timeline step based on the current payment status
   * @param stepStatus The status of the timeline step to check
   * @returns "completed" if the step is before current status
   *          "current" if the step matches current status
   *          "upcoming" if the step is after current status
   */
  const getStepStatus = (stepStatus: PaymentRequestStatus): "completed" | "current" | "upcoming" => {
    const statusOrder = [
      PaymentRequestStatus.PENDING_PAYMENT,
      PaymentRequestStatus.PROCESSING,
      PaymentRequestStatus.COMPLETED,
      PaymentRequestStatus.EXPIRED,
      PaymentRequestStatus.FAILED
    ];

    const currentIdx = statusOrder.indexOf(props.currentStatus);
    const stepIdx = statusOrder.indexOf(stepStatus);

    if (stepIdx < currentIdx) return "completed";
    else if (stepIdx === currentIdx) return "current";
    else return "upcoming";
  };


  return (
    <Card>
      <h3 className="text-lg font-medium text-gray-900 mb-4">Status Transaksi</h3>
      <div className="flow-root">
        <ul role="list" className="-mb-8">
          {props.items.map((event, eventIdx) => {
            const stepStatus = getStepStatus(event.status);
            let iconToUse = event.icon;
            let bgColor = event.iconBackground;

            // Mengganti ikon dengan tanda centang untuk langkah yang selesai
            if (stepStatus === "completed") {
              iconToUse = CheckIcon;
              bgColor = "bg-green-500";
            }

            return (
              <li key={event.id}>
                <div className="relative pb-8">
                  {eventIdx !== props.items.length - 1 && (
                    <span
                      aria-hidden="true"
                      className={classNames(
                        "absolute top-4 left-4 -ml-px h-full w-0.5",
                        stepStatus === "upcoming" ? "bg-gray-200" : "bg-primary-default"
                      )}
                    />
                  )}
                  <div className="relative flex space-x-3">
                    <div>
                      <span
                        className={classNames(
                          stepStatus === "upcoming" ? "bg-gray-300" : bgColor,
                          "flex size-8 items-center justify-center rounded-full ring-8 ring-white"
                        )}
                      >
                        {React.createElement(iconToUse, {
                          className: "size-5 text-white",
                          "aria-hidden": true
                        })}
                      </span>
                    </div>
                    <div className="flex min-w-0 flex-1 justify-between pt-1.5">
                      <div>
                        <p className={classNames(
                          "text-sm",
                          stepStatus === "upcoming" ? "text-gray-500" : "text-gray-900 font-medium"
                        )}>
                          {event.content}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </Card>
  );
}