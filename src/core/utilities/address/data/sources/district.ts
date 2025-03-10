import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { DistrictModel } from "@/core/utilities/address/data/model/district.ts";

export abstract class DistrictService {
  public abstract list(cityId: string): Promise<DistrictModel[]>;
}

export class DistrictServiceImpl implements DistrictService {
  public async list(cityId: string): Promise<DistrictModel[]> {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_API_URL;
      if (!baseUrl) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

      const url = `${baseUrl}/utilities/address/cities/${cityId}/districts`;
      const response = await fetch(url);

      if (!response.ok) {
        const data = await response.json();
        if (!data) throw new ServerError(ErrorCodes.UNKNOWN, { code: response.status });
        throw new ServerError(ErrorCodes.UNKNOWN, { code: data.code, message: data.message });
      }

      const data = await response.json();
      return data.map((p: any) => new DistrictModel(p));
    } catch (err) {
      if (err instanceof ServerError) throw err;
      else throw new ServerError(ErrorCodes.UNKNOWN, { error: err });
    }
  }

}