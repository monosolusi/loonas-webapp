import { ServerError } from "@/core/resources/server-error";
import { RawMaterialEntity } from "@/features/raw-material/domain/entities/raw-material";

type InitialState = {
  rawMaterial: null;
  loading: true;
  error: null;
};

type LoadedState = {
  rawMaterial: RawMaterialEntity;
  loading: false;
  error: null;
};

type ErrorState = {
  rawMaterial: null;
  loading: false;
  error: ServerError;
};

export type UseGetRawMaterialReturnType = InitialState | LoadedState | ErrorState;
