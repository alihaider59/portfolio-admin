import { useEffect, useState } from "react";
import { AdminLayout } from "../../components/layout/AdminLayout";
import { getVisitors, getVisitorById } from "../../api/visitorApi";
import { type Visitor } from "../../types/visitor";
import { Pagination } from "../../components/ui/Pagination";
import { VisitorDetailModal } from "./visitorDetailModal";
import { ResponseModal } from "../../components/ui/ResponseModal";
import { getApiErrorMessage } from "../../utils/apiError";

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
      <div className="bg-white rounded-xl shadow-md border border-[#BFC9D1]/50 overflow-hidden">
        <div className="p-6 border-b border-[#BFC9D1]/50">
          <h2 className="text-xl font-semibold text-[#25343F]">Visitors</h2>
          <p className="text-sm text-[#25343F]/70 mt-1">
            Unique visitors and page views
          </p>
        </div>

        {loading ? (
          <div className="p-12 text-center text-[#25343F]/70">Loading visitors...</div>
        ) : visitors.length === 0 ? (
          <div className="p-12 text-center text-[#25343F]/70">
            No visitors recorded yet.
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-[#EAEFEF] border-b border-[#BFC9D1]">
                    <th className="px-4 py-3 text-sm font-semibold text-[#25343F]">IP Address</th>
                    <th className="px-4 py-3 text-sm font-semibold text-[#25343F]">Visits</th>
                    <th className="px-4 py-3 text-sm font-semibold text-[#25343F]">First Visit</th>
                    <th className="px-4 py-3 text-sm font-semibold text-[#25343F]">Last Seen</th>
                    <th className="px-4 py-3 text-sm font-semibold text-[#25343F]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {visitors.map((visitor) => (
                    <tr
                      key={visitor._id}
                      className="border-b border-[#BFC9D1]/30 hover:bg-[#EAEFEF]/50 transition"
                    >
                      <td className="px-4 py-3 font-mono text-sm text-[#25343F]">
                        {visitor.ipAddress}
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center justify-center min-w-[2rem] px-2 py-0.5 rounded-full bg-[#FF9B51]/20 text-[#25343F] font-medium text-sm">
                          {visitor.visits}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-[#25343F]/70">
                        {formatDate(visitor.createdAt)}
                      </td>
                      <td className="px-4 py-3 text-sm text-[#25343F]/70">
                        {formatDate(visitor.updatedAt)}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => openDetailModal(visitor._id)}
                          className="px-3 py-1.5 rounded-lg bg-[#25343F] text-white hover:bg-[#25343F]/90 text-sm font-medium transition"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-4 border-t border-[#BFC9D1]/50">
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
