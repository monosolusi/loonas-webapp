import Image from "next/image";

type StepIndicatorWithTimeProps = {
  currentStep: number;
  totalSteps: number;
  expectedTime: string; // For example, ~1 menit
};

/**
 * Displays a step indicator with the current step, total steps, and expected time.
 *
 * @param {StepIndicatorWithTimeProps} props - The properties object containing current step, total steps, and expected time.
 * @return {JSX.Element} A JSX element representing the step indicator with time details.
 */
export function StepIndicatorWithTime(props: StepIndicatorWithTimeProps) {
  return (
    <div className="border-primary-300/10 bg-primary-300/5 text-primary-300 flex flex-row items-center gap-2.5 rounded-full border px-3 py-2">
      <span className="text-primary-300 text-sm leading-5 font-medium">
        Step {props.currentStep} of {props.totalSteps}
      </span>
      <div className="bg-primary-300/30 size-1 rounded-full"></div>
      <Image src="/assets/images/time-icon-w14-h14.svg" alt="Time Icon" width={14} height={14} />
      <span className="text-primary-300/70 text-sm leading-5 font-normal">{props.expectedTime}</span>
    </div>
  );
}
