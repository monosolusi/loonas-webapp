import { mutate } from "swr";

export function revalidateSWRKey(...prefixes: string[]) {
  return mutate((key: unknown) => Array.isArray(key) && prefixes.includes(key[0] as string));
}
