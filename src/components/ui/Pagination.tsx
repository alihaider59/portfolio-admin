interface Props {
  page: number;
  total: number;
  limit: number;
  onPageChange: (page: number) => void;
  totalPages?: number;
}

export const Pagination = ({
  page,
  total,
  limit,
  onPageChange,
  totalPages: totalPagesProp,
}: Props): React.ReactNode => {
  const totalPages = totalPagesProp ?? Math.max(1, Math.ceil(total / limit));

  if (totalPages <= 1) return null;

  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 mt-4 sm:mt-6 pt-4 border-t border-[#BFC9D1]">
      <p className="text-xs sm:text-sm text-[#25343F]/70 text-center sm:text-left order-2 sm:order-1">
        Showing <span className="font-medium">{start}</span> to{" "}
        <span className="font-medium">{end}</span> of{" "}
        <span className="font-medium">{total}</span> results
      </p>
      <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 order-1 sm:order-2">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="px-2.5 py-1.5 sm:px-3 rounded-lg bg-[#BFC9D1] text-[#25343F] hover:bg-[#BFC9D1]/80 disabled:opacity-50 disabled:cursor-not-allowed transition text-xs sm:text-sm"
        >
          Previous
        </button>
        <div className="flex flex-wrap justify-center gap-1">
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter((p) => {
              if (totalPages <= 7) return true;
              if (p === 1 || p === totalPages) return true;
              if (Math.abs(p - page) <= 1) return true;
              return false;
            })
            .map((p, idx, arr) => {
              const prev = arr[idx - 1];
              const showEllipsis = prev !== undefined && p - prev > 1;
              return (
                <span key={p} className="flex items-center gap-1">
                  {showEllipsis && (
                    <span className="px-1.5 sm:px-2 text-[#25343F]/50 text-xs">...</span>
                  )}
                  <button
                    onClick={() => onPageChange(p)}
                    className={`min-w-[1.75rem] sm:min-w-[2rem] px-2 sm:px-3 py-1.5 rounded-lg transition text-xs sm:text-sm ${
                      page === p
                        ? "bg-[#FF9B51] text-white"
                        : "bg-[#BFC9D1] text-[#25343F] hover:bg-[#BFC9D1]/80"
                    }`}
                  >
                    {p}
                  </button>
                </span>
              );
            })}
        </div>
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="px-2.5 py-1.5 sm:px-3 rounded-lg bg-[#BFC9D1] text-[#25343F] hover:bg-[#BFC9D1]/80 disabled:opacity-50 disabled:cursor-not-allowed transition text-xs sm:text-sm"
        >
          Next
        </button>
      </div>
    </div>
  );
};
