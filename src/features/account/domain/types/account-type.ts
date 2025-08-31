import { PersonalAccountEntity } from "@/features/account/domain/entities/personal-account";
import { BusinessAccountEntity } from "@/features/account/domain/entities/business-account";
import { PersonalAccountModel } from "@/features/account/data/models/personal-account";
import { BusinessAccountModel } from "@/features/account/data/models/business-account";

export type AccountTypeEntity = PersonalAccountEntity | BusinessAccountEntity;

export type AccountTypeModel = PersonalAccountModel | BusinessAccountModel;
