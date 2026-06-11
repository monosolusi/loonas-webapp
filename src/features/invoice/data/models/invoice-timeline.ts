import { AbstractModel } from "@/core/resources/model";
import { InvoiceType } from "@/features/invoice/domain/enums/invoice-type";
import {
  InvoiceTimelineLastCompletedStatusEntity,
  InvoiceTimelineEntity,
  InvoiceTimelineStepEntity,
} from "@/features/invoice/domain/entities/invoice-timeline";
import { DateTime } from "luxon";

interface InvoiceTimelineStepModelConstructor {
  step: number;
  name: string;
  status: string;
  description: string;
  isCompleted: boolean;
  completedAt: DateTime | null;
}

export class InvoiceTimelineStepModel implements AbstractModel {
  public step: number;
  public name: string;
  public status: string;
  public description: string;
  public isCompleted: boolean;
  public completedAt: DateTime | null;

  constructor(args: InvoiceTimelineStepModelConstructor) {
    this.step = args.step;
    this.name = args.name;
    this.status = args.status;
    this.description = args.description;
    this.isCompleted = args.isCompleted;
    this.completedAt = args.completedAt;
  }

  public static fromJson(doc: Record<string, any>): InvoiceTimelineStepModel {
    return new InvoiceTimelineStepModel({
      step: doc["step"],
      name: doc["name"],
      status: doc["status"],
      description: doc["description"],
      isCompleted: doc["is_completed"],
      completedAt: doc["completed_at"] ? DateTime.fromISO(doc["completed_at"]) : null,
    });
  }

  public toEntity(): InvoiceTimelineStepEntity {
    return new InvoiceTimelineStepEntity({
      step: this.step,
      name: this.name,
      status: this.status,
      description: this.description,
      isCompleted: this.isCompleted,
      completedAt: this.completedAt,
    });
  }
}

interface InvoiceTimelineLastCompletedStatusModelConstructor {
  step: number;
  status: string;
  name: string;
  description: string;
}

export class InvoiceTimelineLastCompletedStatusModel implements AbstractModel {
  public step: number;
  public status: string;
  public name: string;
  public description: string;

  constructor(args: InvoiceTimelineLastCompletedStatusModelConstructor) {
    this.step = args.step;
    this.status = args.status;
    this.name = args.name;
    this.description = args.description;
  }

  public static fromJson(doc: Record<string, any>): InvoiceTimelineLastCompletedStatusModel {
    return new InvoiceTimelineLastCompletedStatusModel({
      step: doc["step"],
      status: doc["status"],
      name: doc["name"],
      description: doc["description"],
    });
  }

  public toEntity(): InvoiceTimelineLastCompletedStatusEntity {
    return new InvoiceTimelineLastCompletedStatusEntity({
      step: this.step,
      status: this.status,
      name: this.name,
      description: this.description,
    });
  }
}

interface InvoiceTimelineModelConstructor {
  invoiceId: string;
  invoiceType: InvoiceType;
  lastCompletedStatus: InvoiceTimelineLastCompletedStatusModel;
  steps: InvoiceTimelineStepModel[];
}

export class InvoiceTimelineModel implements AbstractModel {
  public invoiceId: string;
  public invoiceType: InvoiceType;
  public lastCompletedStatus: InvoiceTimelineLastCompletedStatusModel;
  public steps: InvoiceTimelineStepModel[];

  constructor(args: InvoiceTimelineModelConstructor) {
    this.invoiceId = args.invoiceId;
    this.invoiceType = args.invoiceType;
    this.lastCompletedStatus = args.lastCompletedStatus;
    this.steps = args.steps;
  }

  public static fromJson(doc: Record<string, any>): InvoiceTimelineModel {
    return new InvoiceTimelineModel({
      invoiceId: doc["invoice_id"],
      invoiceType: doc["invoice_type"],
      lastCompletedStatus: InvoiceTimelineLastCompletedStatusModel.fromJson(doc["last_completed_status"]),
      steps: (doc["steps"] as Record<string, any>[]).map(InvoiceTimelineStepModel.fromJson),
    });
  }

  public toEntity(): InvoiceTimelineEntity {
    return new InvoiceTimelineEntity({
      invoiceId: this.invoiceId,
      invoiceType: this.invoiceType,
      lastCompletedStatus: this.lastCompletedStatus.toEntity(),
      steps: this.steps.map((step) => step.toEntity()),
    });
  }
}
