import { PaginationMeta } from "@/core/resources/paginated";
import { TableContainer } from "@/core/presentations/components/table/table-container";
import { TableHeader } from "@/core/presentations/components/table/table-header";
import { TablePagination } from "@/core/presentations/components/table/table-pagination";
import { CashCategoryEntity } from "@/features/accounting/domain/entities/cash-category";
import {
  CashCategoryRow,
  CASH_CATEGORY_GRID_COLUMNS,
} from "@/app/(authenticated)/accounting/cash-categories/_components/cash-category-row";

type CashCategoriesTableProps = {
  categories: CashCategoryEntity[];
  meta: PaginationMeta | null;
  isLoadingPage: boolean;
  onEdit: (category: CashCategoryEntity) => void;
  onDelete: (category: CashCategoryEntity) => void;
  onEditAccount: (category: CashCategoryEntity) => void;
};

export function CashCategoriesTable({
  categories,
  meta,
  isLoadingPage,
  onEdit,
  onDelete,
  onEditAccount,
}: CashCategoriesTableProps) {
  return (
    <div className="flex flex-col gap-y-4" aria-busy={isLoadingPage}>
      <TableContainer>
        <TableHeader
          columns={[
            { label: "Arah" },
            { label: "Nama Kategori" },
            { label: "Akun" },
            { label: "Jenis" },
            { label: "Aksi", align: "right" },
          ]}
          className={CASH_CATEGORY_GRID_COLUMNS}
          hideOnMobile
        />
        {categories.map((category) => (
          <CashCategoryRow
            key={category.id}
            category={category}
            onEdit={onEdit}
            onDelete={onDelete}
            onEditAccount={onEditAccount}
          />
        ))}
        {/* The list endpoint takes `direction` only — no page/limit — so `meta` is
            synthesised with totalPages 1 and this control never mounts. Kept for the
            standard list-page shape. */}
        {meta && meta.totalPages > 1 && (
          <TablePagination
            displayedCount={categories.length}
            meta={meta}
            currentPage={meta.page}
            onPageChange={() => {}}
          />
        )}
      </TableContainer>
    </div>
  );
}
