import { AbstractEntity } from "@/core/resources/entity";
import { DateTime } from "luxon";

export class PartnerEntity implements AbstractEntity {
  constructor(
    public id: string,
    public name: string,
    public email: string,
    public phoneNumber: string,
    public createdAt: DateTime,
    public updatedAt: DateTime,
    public deletedAt?: DateTime
  ) {
  }

}