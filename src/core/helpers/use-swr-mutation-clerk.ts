import { useClerk } from "@clerk/nextjs";
import useSWRMutation from "swr/mutation";

type ClerkInstance = ReturnType<typeof useClerk>;

export function useSWRMutationClerk<Data, ExtraArg extends Record<string, unknown>>(
  key: string,
  fetcher: (key: string, options: { arg: ExtraArg & { clerk: ClerkInstance } }) => Promise<Data>,
) {
  const clerk = useClerk();
  const { trigger, ...rest } = useSWRMutation(key, fetcher);

  const wrappedTrigger = (data: ExtraArg) =>
    (trigger as (arg: ExtraArg & { clerk: ClerkInstance }) => Promise<Data>)({ ...data, clerk });

  return {
    ...rest,
    trigger: wrappedTrigger,
  };
}
