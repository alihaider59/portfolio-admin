import { useEffect, useState } from "react";
import { AdminLayout } from "../../components/layout/AdminLayout";
import { getVisitors, getVisitorById } from "../../api/visitorApi";
import { type Visitor } from "../../types/visitor";
import { Pagination } from "../../components/ui/Pagination";
import { VisitorDetailModal } from "./visitorDetailModal";
import { ResponseModal } from "../../components/ui/ResponseModal";
import { getApiErrorMessage } from "../../utils/apiError";
import { useMediaQuery } from "../../hooks/useMediaQuery";

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

export const VisitorListPage = () => {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [detailItem, setDetailItem] = useState<Visitor | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [responseModal, setResponseModal] = useState<{
    type: "success" | "error";
    title: string;
    message: string;
  } | null>(null);
  const showTableView = useMediaQuery(1024);

  const fetchVisitors = async (): Promise<void> => {
    setLoading(true);
    try {
      const res = await getVisitors(page, limit);
      setVisitors(res.data);
      setTotal(res.pagination.total);
    } catch (err) {
      setResponseModal({
        type: "error",
        title: "Error",
        message: getApiErrorMessage(err, "Failed to load visitors."),
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisitors();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const openDetailModal = async (id: string) => {
    setDetailModalOpen(true);
    setDetailItem(null);
    setDetailLoading(true);
    try {
      const res = await getVisitorById(id);
      setDetailItem(res.data);
    } catch (err) {
      setDetailItem(null);
      setResponseModal({
        type: "error",
        title: "Error",
        message: getApiErrorMessage(err, "Failed to load visitor details."),
      });
    } finally {
      setDetailLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="bg-white rounded-lg sm:rounded-xl shadow-md border border-[#BFC9D1]/50 overflow-hidden min-w-0 w-full">
        <div className="p-4 sm:p-6 lg:p-6 xl:p-8 border-b border-[#BFC9D1]/50">
          <h2 className="text-lg sm:text-xl lg:text-xl xl:text-2xl font-semibold text-[#25343F]">Visitors</h2>
          <p className="text-sm lg:text-base xl:text-base text-[#25343F]/70 mt-1">
            Unique visitors and page views
          </p>
        </div>

        {loading ? (
          <div className="p-6 sm:p-12 text-center text-[#25343F]/70 text-sm sm:text-base">Loading visitors...</div>
        ) : visitors.length === 0 ? (
          <div className="p-6 sm:p-12 text-center text-[#25343F]/70 text-sm sm:text-base">
            No visitors recorded yet.
          </div>
        ) : (
          <>
            {/* One layout only: cards below 1024px, table from 1024px up */}
            {!showTableView ? (
              <div className="divide-y divide-[#BFC9D1]/30">
                {visitors.map((visitor) => (
                  <div
                    key={visitor._id}
                    className="p-4 bg-[#FAFAFA] hover:bg-[#EAEFEF]/50 transition"
                  >
                    <p className="font-mono font-medium text-[#25343F] text-sm break-all">{visitor.ipAddress}</p>
                    <div className="flex items-center justify-between mt-2 flex-wrap gap-2">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#FF9B51]/20 text-[#25343F] font-medium text-sm">
                        {visitor.visits} visit{visitor.visits !== 1 ? "s" : ""}
                      </span>
                    </div>
                    <p className="text-[#25343F]/70 text-xs mt-2">First: {formatDate(visitor.createdAt)}</p>
                    <p className="text-[#25343F]/70 text-xs">Last: {formatDate(visitor.updatedAt)}</p>
                    <button
                      onClick={() => openDetailModal(visitor._id)}
                      className="w-full mt-3 py-2 rounded-lg bg-[#25343F] text-white text-sm font-medium"
                    >
                      View
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="table-scroll-wrap">
                <table className="w-full min-w-[520px] text-left border-collapse table-fixed">
                  <colgroup>
                    <col style={{ width: "24%" }} />
                    <col style={{ width: "10%" }} />
                    <col style={{ width: "26%" }} />
                    <col style={{ width: "26%" }} />
                    <col style={{ width: "14%" }} />
                  </colgroup>
                  <thead>
                    <tr className="bg-[#EAEFEF] border-b border-[#BFC9D1]">
                      <th className="px-3 py-2 sm:px-4 sm:py-3 lg:px-4 lg:py-3 xl:px-5 xl:py-4 text-xs sm:text-sm lg:text-sm xl:text-base font-semibold text-[#25343F] text-left">IP Address</th>
                      <th className="px-3 py-2 sm:px-4 sm:py-3 lg:px-4 lg:py-3 xl:px-5 xl:py-4 text-xs sm:text-sm lg:text-sm xl:text-base font-semibold text-[#25343F] text-left">Visits</th>
                      <th className="px-3 py-2 sm:px-4 sm:py-3 lg:px-4 lg:py-3 xl:px-5 xl:py-4 text-xs sm:text-sm lg:text-sm xl:text-base font-semibold text-[#25343F] text-left">First Visit</th>
                      <th className="px-3 py-2 sm:px-4 sm:py-3 lg:px-4 lg:py-3 xl:px-5 xl:py-4 text-xs sm:text-sm lg:text-sm xl:text-base font-semibold text-[#25343F] text-left">Last Seen</th>
                      <th className="px-3 py-2 sm:px-4 sm:py-3 lg:px-4 lg:py-3 xl:px-5 xl:py-4 text-xs sm:text-sm lg:text-sm xl:text-base font-semibold text-[#25343F] text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visitors.map((visitor) => (
                      <tr key={visitor._id} className="border-b border-[#BFC9D1]/30 hover:bg-[#EAEFEF]/50 transition">
                        <td className="px-3 py-2 sm:px-4 sm:py-3 lg:px-4 lg:py-3 xl:px-5 xl:py-4 min-w-0">
                          <span className="block truncate font-mono text-[#25343F] text-xs sm:text-sm lg:text-sm xl:text-base" title={visitor.ipAddress}>{visitor.ipAddress}</span>
                        </td>
                        <td className="px-3 py-2 sm:px-4 sm:py-3 lg:px-4 lg:py-3 xl:px-5 xl:py-4">
                          <span className="inline-flex items-center justify-center min-w-[2rem] px-2 py-0.5 rounded-full bg-[#FF9B51]/20 text-[#25343F] font-medium text-xs sm:text-sm lg:text-sm xl:text-base">{visitor.visits}</span>
                        </td>
                        <td className="px-3 py-2 sm:px-4 sm:py-3 lg:px-4 lg:py-3 xl:px-5 xl:py-4 text-xs sm:text-sm lg:text-sm xl:text-base text-[#25343F]/70 whitespace-nowrap">{formatDate(visitor.createdAt)}</td>
                        <td className="px-3 py-2 sm:px-4 sm:py-3 lg:px-4 lg:py-3 xl:px-5 xl:py-4 text-xs sm:text-sm lg:text-sm xl:text-base text-[#25343F]/70 whitespace-nowrap">{formatDate(visitor.updatedAt)}</td>
                        <td className="px-3 py-2 sm:px-4 sm:py-3 lg:px-4 lg:py-3 xl:px-5 xl:py-4 min-w-0">
                          <button type="button" onClick={() => openDetailModal(visitor._id)} className="shrink-0 px-3 py-1.5 sm:px-4 sm:py-2 lg:px-4 lg:py-2 xl:px-5 xl:py-2 rounded-lg bg-[#25343F] text-white hover:bg-[#25343F]/90 text-xs sm:text-sm lg:text-sm xl:text-base font-medium whitespace-nowrap">
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="p-4 sm:p-4 lg:p-5 xl:p-6 border-t border-[#BFC9D1]/50">
              <Pagination
                page={page}
                limit={limit}
                total={total}
                onPageChange={setPage}
              />
            </div>
          </>
        )}
      </div>

      {detailModalOpen && (
        <VisitorDetailModal
          item={detailItem}
          loading={detailLoading}
          onClose={() => {
            setDetailModalOpen(false);
            setDetailItem(null);
          }}
        />
      )}

      {responseModal && (
        <ResponseModal
          type={responseModal.type}
          title={responseModal.title}
          message={responseModal.message}
          onClose={() => setResponseModal(null)}
        />
      )}
    </AdminLayout>
  );
};
