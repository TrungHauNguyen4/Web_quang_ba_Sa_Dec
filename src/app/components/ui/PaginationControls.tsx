type PaginationControlsProps = {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  pageSizeOptions?: number[];
  className?: string;
};

export function PaginationControls({
  page,
  pageSize,
  total,
  totalPages,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50],
  className,
}: PaginationControlsProps) {
  const safeTotalPages = Math.max(totalPages, 1);
  const currentPage = Math.min(Math.max(page, 1), safeTotalPages);
  const from = total === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const to = total === 0 ? 0 : Math.min(currentPage * pageSize, total);

  return (
    <div className={`p-4 border-t border-slate-100 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between ${className ?? ""}`}>
      <div className="text-sm text-slate-500">Hiển thị {from}-{to} / {total} bản ghi</div>
      <div className="flex items-center gap-2">
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className="border border-slate-200 rounded-lg px-2.5 py-1.5 text-sm bg-white"
        >
          {pageSizeOptions.map((option) => (
            <option key={option} value={option}>
              {option}/trang
            </option>
          ))}
        </select>
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm disabled:opacity-50"
        >
          Trước
        </button>
        <span className="text-sm text-slate-600 min-w-[80px] text-center">
          Trang {currentPage}/{safeTotalPages}
        </span>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= safeTotalPages || total === 0}
          className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm disabled:opacity-50"
        >
          Sau
        </button>
      </div>
    </div>
  );
}
