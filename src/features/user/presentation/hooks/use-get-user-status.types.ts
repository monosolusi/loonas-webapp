import { useClerk } from "@clerk/nextjs";
import { KeyedMutator } from "swr";
import { ServerError } from "@/core/resources/server-error";
import { UserStatusEntity } from "@/features/user/domain/entities/user-status.entity";

export type GetUserStatusFetcherParams = {
  clerk: ReturnType<typeof useClerk>;
};

type InitialState = {
  status: null;
  loading: true;
  error: null;
  refresh: null;
};

type LoadedState = {
  status: UserStatusEntity;
  loading: false;
  error: null;
  refresh: KeyedMutator<UserStatusEntity>;
};

type ErrorState = {
  status: null;
  loading: false;
  error: ServerError;
  refresh: null;
};

export type UseGetUserStatusReturnType = InitialState | LoadedState | ErrorState;
