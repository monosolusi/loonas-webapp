import { AbstractModel } from "@/core/resources/model";
import { InvoiceType } from "@/features/invoice/domain/enums/invoice-type";
import {
  InvoiceTimelineEntity,
  InvoiceTimelineStepEntity,
} from "@/features/invoice/domain/entities/invoice-timeline";
import { DateTime } from "luxon";

interface InvoiceTimelineStepModelConstructor {
  step: number;
  name: string;
  isCompleted: boolean;
  completedAt: DateTime | null;
}

export class InvoiceTimelineStepModel implements AbstractModel {
  public step: number;
  public name: string;
  public isCompleted: boolean;
  public completedAt: DateTime | null;

  constructor(args: InvoiceTimelineStepModelConstructor) {
    this.step = args.step;
    this.name = args.name;
    this.isCompleted = args.isCompleted;
    this.completedAt = args.completedAt;
  }

  public static fromJson(doc: Record<string, any>): InvoiceTimelineStepModel {
    return new InvoiceTimelineStepModel({
      step: doc["step"],
      name: doc["name"],
      isCompleted: doc["is_completed"],
      completedAt: doc["completed_at"] ? DateTime.fromISO(doc["completed_at"]) : null,
    });
  }

  public toEntity(): InvoiceTimelineStepEntity {
    return new InvoiceTimelineStepEntity({
      step: this.step,
      name: this.name,
      isCompleted: this.isCompleted,
      completedAt: this.completedAt,
    });
  }
}

interface InvoiceTimelineModelConstructor {
  invoiceId: string;
  invoiceType: InvoiceType;
  steps: InvoiceTimelineStepModel[];
}

export class InvoiceTimelineModel implements AbstractModel {
  public invoiceId: string;
  public invoiceType: InvoiceType;
  public steps: InvoiceTimelineStepModel[];

  constructor(args: InvoiceTimelineModelConstructor) {
    this.invoiceId = args.invoiceId;
    this.invoiceType = args.invoiceType;
    this.steps = args.steps;
  }

  public static fromJson(doc: Record<string, any>): InvoiceTimelineModel {
    return new InvoiceTimelineModel({
      invoiceId: doc["invoice_id"],
      invoiceType: doc["invoice_type"],
      steps: (doc["steps"] as Record<string, any>[]).map(InvoiceTimelineStepModel.fromJson),
    });
  }

  public toEntity(): InvoiceTimelineEntity {
    return new InvoiceTimelineEntity({
      invoiceId: this.invoiceId,
      invoiceType: this.invoiceType,
      steps: this.steps.map((step) => step.toEntity()),
    });
  }
}
