import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { CityModel } from "@/core/utilities/address/data/model/city";

export abstract class CityService {
  public abstract list(provinceId: string): Promise<CityModel[]>;
}

export class CityServiceImpl implements CityService {
  public async list(provinceId: string): Promise<CityModel[]> {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_API_URL;
      if (!baseUrl) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

      const url = `${baseUrl}/utilities/address/provinces/${provinceId}/cities`;
      const response = await fetch(url);

      if (!response.ok) {
        const data = await response.json();
        if (!data) throw new ServerError(ErrorCodes.UNKNOWN, { code: response.status });
        throw new ServerError(ErrorCodes.UNKNOWN, { code: data.code, message: data.message });
      }

      const data = await response.json();
      return data.data.map((p: any) => new CityModel(p));
    } catch (err) {
      if (err instanceof ServerError) throw err;
      else throw new ServerError(ErrorCodes.UNKNOWN, { error: err });
    }
  }

}