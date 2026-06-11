import { MemberEntity } from "@/features/member/domain/entities/member";
import { KeyedMutator } from "swr";
import { ServerError } from "@/core/resources/server-error";

type InitialState = {
  members: null;
  loading: true;
  error: null;
  refresh: null;
};

type LoadedState = {
  members: MemberEntity[];
  loading: false;
  error: null;
  refresh: KeyedMutator<MemberEntity[]>;
};

type ErrorState = {
  members: null;
  loading: false;
  error: ServerError;
  refresh: null;
};

export type UseListMembersReturnType = InitialState | LoadedState | ErrorState;
