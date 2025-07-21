import { DataState } from "@/core/resources/data-state";
import { UseCase } from "@/core/resources/use-case";
import { PublicPayInDetailEntity } from "@/features/payment/domain/entities/public-pay-in-detail";
import { PayInDetailRepository } from "@/features/payment/domain/repositories/pay-in-detail";

export class GetPublicPayInDetailForOutgoingInvoiceUseCaseParams {
  public readonly invoiceId: string;

  constructor(args: { invoiceId: string }) {
    this.invoiceId = args.invoiceId;
  }
}

export class GetPublicPayInDetailForOutgoingInvoiceUseCase
  implements UseCase<DataState<PublicPayInDetailEntity>, GetPublicPayInDetailForOutgoingInvoiceUseCaseParams>
{
  constructor(private readonly payInDetailRepository: PayInDetailRepository) {}

  public async execute(
    params: GetPublicPayInDetailForOutgoingInvoiceUseCaseParams,
  ): Promise<DataState<PublicPayInDetailEntity>> {
    return this.payInDetailRepository.getPublic({ invoiceId: params.invoiceId });
  }
}
