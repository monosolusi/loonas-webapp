import { TaxType } from "@/features/tax/domain/enums/tax-type";
import { UseCase } from "@/core/resources/use-case";
import { DataFailed, DataState } from "@/core/resources/data-state";
import { SessionRepository } from "@/features/authentication/domain/repositories/session";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { CalculateTaxResultEntity } from "@/features/tax/domain/entities/calculate-tax-result";
import { TaxRepository } from "@/features/tax/domain/repositories/tax";

interface CalculateTaxResultUseCaseParamsConstructor {
  amountBeforeTax: number;
  taxType: TaxType;
  tax?: number;
  taxBase?: number;
}

export class CalculateTaxUseCaseParams {
  public amountBeforeTax: number;
  public taxType: TaxType;
  public tax?: number; // This is for the manual tax type
  public taxBase?: number; // this is for the manual tax type

  constructor(args: CalculateTaxResultUseCaseParamsConstructor) {
    this.amountBeforeTax = args.amountBeforeTax;
    this.taxType = args.taxType;
    this.tax = args.tax;
    this.taxBase = args.taxBase;
  }
}

export class CalculateTaxUseCase implements UseCase<DataState<CalculateTaxResultEntity>, CalculateTaxUseCaseParams> {
  constructor(
    private readonly taxRepository: TaxRepository,
    private readonly sessionRepository: SessionRepository,
  ) {}

  public async execute(params: CalculateTaxUseCaseParams): Promise<DataState<CalculateTaxResultEntity>> {
    try {
      const session = await this.sessionRepository.retrieve();
      if (session instanceof DataFailed) return session;
      if (!session.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

      const taxResult = await this.taxRepository.calculateTax(
        {
          amountBeforeTax: params.amountBeforeTax,
          taxType: params.taxType,
          tax: params.tax,
          taxBase: params.taxBase,
        },
        session.data,
      );

      if (taxResult instanceof DataFailed) return taxResult;
      if (!taxResult.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
      return taxResult;
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }
}
