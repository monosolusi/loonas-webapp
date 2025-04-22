import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { DataState } from "@/core/resources/data-state";
import { PartnerEntity } from "../entities/partner";

export abstract class PartnerRepository {
  public abstract create(
    name: string,
    email: string,
    phone: string,
    session: SessionEntity
  ): Promise<DataState<boolean>>;

  public abstract list(
    session: SessionEntity
  ): Promise<DataState<PartnerEntity[]>>;
}