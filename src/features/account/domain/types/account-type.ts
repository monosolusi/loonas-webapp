import { PersonalAccountEntity } from "@/features/account/domain/entities/personal-account";
import { BusinessAccountEntity } from "@/features/account/domain/entities/business-account";
import { PersonalAccountModel } from "@/features/account/data/models/personal-account";
import { BusinessAccountModel } from "@/features/account/data/models/business-account";
import { ClerkAccountEntity } from "@/features/account/domain/entities/clerk-account.entity";
import { ClerkAccountModel } from "@/features/account/data/models/clerk-account.model";

export type AccountTypeEntity = PersonalAccountEntity | BusinessAccountEntity | ClerkAccountEntity;

export type AccountTypeModel = PersonalAccountModel | BusinessAccountModel | ClerkAccountModel;
