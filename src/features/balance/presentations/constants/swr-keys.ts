// Deliberately not "get-account-balance" — that is the accounting GL's key
// (`useGetAccountBalance`), and `revalidateSWRKey()` matches on `key[0]` only, so a shared
// constant would sweep the GL's cache alongside this one. This slice shares no key with the
// accounting ledger.
export const BALANCE_SWR_KEYS = {
  GET_BALANCE: "get-balance",
  LIST_BALANCE_MOVEMENTS: "list-balance-movements",
} as const;
