import { ProvinceModel } from "@/core/utilities/address/data/model/province";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";

export abstract class ProvinceService {
  public abstract list(): Promise<ProvinceModel[]>;
}

export class ProvinceServiceImpl implements ProvinceService {
  public async list(): Promise<ProvinceModel[]> {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_API_URL;
      if (!baseUrl) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

      const url = `${baseUrl}/utilities/address/provinces`;
      const response = await fetch(url);

      if (!response.ok) {
        const data = await response.json();
        if (!data) throw new ServerError(ErrorCodes.UNKNOWN, { code: response.status });
        throw new ServerError(ErrorCodes.UNKNOWN, { code: data.code, message: data.message });
      }

      const data = await response.json();
      return data.map((p: any) => new ProvinceModel(p));
    } catch (err) {
      if (err instanceof ServerError) throw err;
      else throw new ServerError(ErrorCodes.UNKNOWN, { error: err });
    }
  }

}