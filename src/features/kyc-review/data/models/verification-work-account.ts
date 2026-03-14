import { AbstractModel } from "@/core/resources/model";
import { VerificationWorkAccountEntity } from "@/features/kyc-review/domain/entities/verification-work-account";

interface VerificationWorkAccountModelConstructor {
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

export class VerificationWorkAccountModel implements AbstractModel {
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

  constructor(args: VerificationWorkAccountModelConstructor) {
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

  public static fromJson(json: Record<string, any>): VerificationWorkAccountModel {
    return new VerificationWorkAccountModel({
      id: json["id"],
      type: json["type"],
      fullName: json["full_name"] ?? json["company_name"] ?? "",
      nationality: json["nationality"],
      idNumber: json["id_number"],
      occupation: json["occupation"],
      placeOfBirth: json["place_of_birth"],
      dateOfBirth: json["date_of_birth"],
      province: json["province"],
      city: json["city"],
      district: json["district"],
      subdistrict: json["subdistrict"],
      address: json["address"],
      companyEmail: json["company_email"],
      companyPhoneNumber: json["company_phone_number"],
      companyAddress: json["company_address"],
    });
  }

  toEntity(): VerificationWorkAccountEntity {
    return new VerificationWorkAccountEntity({
      id: this.id,
      type: this.type,
      fullName: this.fullName,
      nationality: this.nationality,
      idNumber: this.idNumber,
      occupation: this.occupation,
      placeOfBirth: this.placeOfBirth,
      dateOfBirth: this.dateOfBirth,
      province: this.province,
      city: this.city,
      district: this.district,
      subdistrict: this.subdistrict,
      address: this.address,
      companyEmail: this.companyEmail,
      companyPhoneNumber: this.companyPhoneNumber,
      companyAddress: this.companyAddress,
    });
  }
}
