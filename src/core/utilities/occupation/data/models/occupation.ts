import { OccupationEntity } from "@/core/utilities/occupation/domain/entities/occupation";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";

interface OccupationModelConstructor {
  id: string;
  label?: string;
}

export class OccupationModel {
  public id: string;
  public label: string;

  constructor({ id, label }: OccupationModelConstructor) {
    this.id = id;
    this.label = label || this.inferLabel(id);
  }

  public static fromJson(json: Record<string, any>): OccupationModel {
    return new OccupationModel({
      id: json.id,
      label: json.label
    });
  }

  toEntity(): OccupationEntity {
    return new OccupationEntity({
      id: this.id,
      label: this.label
    });
  }

  private inferLabel(id: string) {
    if (!id) return "Tidak Diketahui";
    const data: { id: string, label: string }[] = [
      { id: "PRIVATE_EMPLOYEE", label: "Pegawai Swasta" },
      { id: "PUBLIC_EMPLOYEE", label: "Pegawai Negeri" },
      { id: "SELF_EMPLOYED", label: "Wiraswasta" },
      { id: "FREELANCE", label: "Freelancer" },
      { id: "PROFESSIONAL", label: "Profesional" },
      { id: "STUDENT", label: "Pelajar" },
      { id: "UNEMPLOYED", label: "Tidak Bekerja" }
    ];

    const result: { id: string, label: string } | undefined = data.find((item: any) => item.id === id);
    if (!result) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
    return result.label;
  }
}