import { AbstractEntity } from "@/core/resources/entity";

interface VerificationWorkAccountEntityConstructor {
  id: string;
  type: string;
  fullName: string;
  nationality?: string;
  idNumber?: string;
  occupation?: string;
  placeOfBirth?: string;
  dateOfBirth?: string;
  province?: string;
  city?: string;
  district?: string;
  subdistrict?: string;
  address?: string;
  companyEmail?: string;
  companyPhoneNumber?: string;
  companyAddress?: string;
}

export class VerificationWorkAccountEntity implements AbstractEntity {
  public readonly id: string;
  public readonly type: string;
  public readonly fullName: string;
  public readonly nationality?: string;
  public readonly idNumber?: string;
  public readonly occupation?: string;
  public readonly placeOfBirth?: string;
  public readonly dateOfBirth?: string;
  public readonly province?: string;
  public readonly city?: string;
  public readonly district?: string;
  public readonly subdistrict?: string;
  public readonly address?: string;
  public readonly companyEmail?: string;
  public readonly companyPhoneNumber?: string;
  public readonly companyAddress?: string;

  constructor(args: VerificationWorkAccountEntityConstructor) {
    this.id = args.id;
    this.type = args.type;
    this.fullName = args.fullName;
    this.nationality = args.nationality;
    this.idNumber = args.idNumber;
    this.occupation = args.occupation;
    this.placeOfBirth = args.placeOfBirth;
    this.dateOfBirth = args.dateOfBirth;
    this.province = args.province;
    this.city = args.city;
    this.district = args.district;
    this.subdistrict = args.subdistrict;
    this.address = args.address;
    this.companyEmail = args.companyEmail;
    this.companyPhoneNumber = args.companyPhoneNumber;
    this.companyAddress = args.companyAddress;
  }
}
