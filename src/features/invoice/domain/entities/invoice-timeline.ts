import { AbstractEntity } from "@/core/resources/entity";
import { InvoiceType } from "@/features/invoice/domain/enums/invoice-type";
import { DateTime } from "luxon";

interface InvoiceTimelineStepEntityConstructor {
  step: number;
  name: string;
  isCompleted: boolean;
  completedAt: DateTime | null;
}

export class InvoiceTimelineStepEntity implements AbstractEntity {
  public step: number;
  public name: string;
  public isCompleted: boolean;
  public completedAt: DateTime | null;

  constructor(args: InvoiceTimelineStepEntityConstructor) {
    this.step = args.step;
    this.name = args.name;
    this.isCompleted = args.isCompleted;
    this.completedAt = args.completedAt;
  }
}

interface InvoiceTimelineEntityConstructor {
  invoiceId: string;
  invoiceType: InvoiceType;
  steps: InvoiceTimelineStepEntity[];
}

export class InvoiceTimelineEntity implements AbstractEntity {
  public invoiceId: string;
  public invoiceType: InvoiceType;
  public steps: InvoiceTimelineStepEntity[];

  constructor(args: InvoiceTimelineEntityConstructor) {
    this.invoiceId = args.invoiceId;
    this.invoiceType = args.invoiceType;
    this.steps = args.steps;
  }
}
