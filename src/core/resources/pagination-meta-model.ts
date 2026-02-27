import { PaginationMeta } from "@/core/resources/paginated";

export class PaginationMetaModel {
  public page: number;
  public limit: number;
  public total: number;
  public totalPages: number;

  constructor(args: { page: number; limit: number; total: number; totalPages: number }) {
    this.page = args.page;
    this.limit = args.limit;
    this.total = args.total;
    this.totalPages = args.totalPages;
  }

  public static fromJson(doc: Record<string, any>): PaginationMetaModel {
    return new PaginationMetaModel({
      page: doc["page"],
      limit: doc["limit"],
      total: doc["total"],
      totalPages: doc["total_pages"],
    });
  }

  public toMeta(): PaginationMeta {
    return {
      page: this.page,
      limit: this.limit,
      total: this.total,
      totalPages: this.totalPages,
    };
  }
}
