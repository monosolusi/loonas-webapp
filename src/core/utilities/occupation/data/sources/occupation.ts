import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { OccupationModel } from "@/core/utilities/occupation/data/models/occupation";

export abstract class OccupationService {
  public abstract list(): Promise<OccupationModel[]>;
}

export class OccupationServiceImpl implements OccupationService {
  public async list(): Promise<OccupationModel[]> {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_API_URL;
      if (!baseUrl) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

      const url = `${baseUrl}/utilities/occupations`;
      const response = await fetch(url);

      if (!response.ok) {
        const data = await response.json();
        if (!data) throw new ServerError(ErrorCodes.UNKNOWN, { code: response.status });
        throw new ServerError(ErrorCodes.UNKNOWN, { code: data.code, message: data.message });
      }

      const data = await response.json();
      return data.data.map((o: any) => new OccupationModel(o));
    } catch (err) {
      if (err instanceof ServerError) throw err;
      else throw new ServerError(ErrorCodes.UNKNOWN, { error: err });
    }
  }
};