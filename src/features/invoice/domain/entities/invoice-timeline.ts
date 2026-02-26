import { AbstractEntity } from "@/core/resources/entity";
import { InvoiceType } from "@/features/invoice/domain/enums/invoice-type";
import { DateTime } from "luxon";

interface InvoiceTimelineStepEntityConstructor {
  step: number;
  name: string;
  status: string;
  description: string;
  isCompleted: boolean;
  completedAt: DateTime | null;
}

export class InvoiceTimelineStepEntity implements AbstractEntity {
  public step: number;
  public name: string;
  public status: string;
  public description: string;
  public isCompleted: boolean;
  public completedAt: DateTime | null;

  constructor(args: InvoiceTimelineStepEntityConstructor) {
    this.step = args.step;
    this.name = args.name;
    this.status = args.status;
    this.description = args.description;
    this.isCompleted = args.isCompleted;
    this.completedAt = args.completedAt;
  }
}

interface InvoiceTimelineActiveStatusEntityConstructor {
  step: number;
  status: string;
  name: string;
  description: string;
}

export class InvoiceTimelineActiveStatusEntity implements AbstractEntity {
  public step: number;
  public status: string;
  public name: string;
  public description: string;

  constructor(args: InvoiceTimelineActiveStatusEntityConstructor) {
    this.step = args.step;
    this.status = args.status;
    this.name = args.name;
    this.description = args.description;
  }
}

interface InvoiceTimelineEntityConstructor {
  invoiceId: string;
  invoiceType: InvoiceType;
  currentActiveStatus: InvoiceTimelineActiveStatusEntity;
  steps: InvoiceTimelineStepEntity[];
}

export class InvoiceTimelineEntity implements AbstractEntity {
  public invoiceId: string;
  public invoiceType: InvoiceType;
  public currentActiveStatus: InvoiceTimelineActiveStatusEntity;
  public steps: InvoiceTimelineStepEntity[];

  constructor(args: InvoiceTimelineEntityConstructor) {
    this.invoiceId = args.invoiceId;
    this.invoiceType = args.invoiceType;
    this.currentActiveStatus = args.currentActiveStatus;
    this.steps = args.steps;
  }
}
