import clsx from "clsx";

type StatusBoxWrapperProps = {
  children: React.ReactNode;
  backgroundColor: string; // Tailwind CSS class Name
  borderColor: string; // Tailwind CSS class Name
};

export function StatusBoxWrapper(props: StatusBoxWrapperProps) {
  return (
    <div
      className={clsx(
        "flex flex-col items-center gap-y-6 rounded-lg border p-8",
        `${props.backgroundColor}/5 ${props.borderColor}/20`,
      )}
    >
      {props.children}
    </div>
  );
}
