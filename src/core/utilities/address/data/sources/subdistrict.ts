import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SubdistrictModel } from "@/core/utilities/address/data/model/subdistrict.ts";

export abstract class SubdistrictService {
  public abstract list(cityId: string): Promise<SubdistrictModel[]>;
}

export class SubdistrictServiceImpl implements SubdistrictService {
  public async list(cityId: string): Promise<SubdistrictModel[]> {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_API_URL;
      if (!baseUrl) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

      const url = `${baseUrl}/utilities/address/districts/${cityId}/subdistricts`;
      const response = await fetch(url);

      if (!response.ok) {
        const data = await response.json();
        if (!data) throw new ServerError(ErrorCodes.UNKNOWN, { code: response.status });
        throw new ServerError(ErrorCodes.UNKNOWN, { code: data.code, message: data.message });
      }

      const data = await response.json();
      return data.map((p: any) => new SubdistrictModel(p));
    } catch (err) {
      if (err instanceof ServerError) throw err;
      else throw new ServerError(ErrorCodes.UNKNOWN, { error: err });
    }
  }

}