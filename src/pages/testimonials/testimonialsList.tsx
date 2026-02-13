import { useEffect, useState } from "react";
import { AdminLayout } from "../../components/layout/AdminLayout";
import {
  getTestimonials,
  getTestimonial,
  deleteTestimonial,
} from "../../api/testimonialsApi";
import { type Testimonial } from "../../types/testimonial";
import { Pagination } from "../../components/ui/Pagination";
import { TestimonialModal } from "./testimonialModal";
import { TestimonialDetailModal } from "./testimonialDetailModal";
import { AvatarPlaceholder } from "../../components/ui/AvatarPlaceholder";
import { ResponseModal } from "../../components/ui/ResponseModal";
import { ConfirmModal } from "../../components/ui/ConfirmModal";
import { getApiErrorMessage } from "../../utils/apiError";
import { useMediaQuery } from "../../hooks/useMediaQuery";

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

const truncateText = (text: string, maxLen: number) =>
  text.length > maxLen ? `${text.slice(0, maxLen)}...` : text;

export const TestimonialListPage = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<Testimonial | null>(null);
  const [detailItem, setDetailItem] = useState<Testimonial | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [responseModal, setResponseModal] = useState<{
    type: "success" | "error";
    title: string;
    message: string;
  } | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Testimonial | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const showTableView = useMediaQuery(1024);

  const fetchTestimonials = async () => {
    setLoading(true);
    try {
      const res = await getTestimonials(page, limit);
      setTestimonials(res.data);
      setTotal(res.pagination.total);
      setTotalPages(
        res.pagination.totalPages ?? Math.ceil(res.pagination.total / limit)
      );
    } catch (err) {
      setResponseModal({
        type: "error",
        title: "Error",
        message: getApiErrorMessage(err, "Failed to load testimonials."),
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const handleDelete = async (item: Testimonial) => {
    setDeleteLoading(true);
    try {
      await deleteTestimonial(item._id);
      setConfirmDelete(null);
      setResponseModal({
        type: "success",
        title: "Deleted",
        message: "Testimonial deleted successfully.",
      });
      fetchTestimonials();
    } catch (err) {
      setResponseModal({
        type: "error",
        title: "Delete Failed",
        message: getApiErrorMessage(err, "Failed to delete testimonial."),
      });
    } finally {
      setDeleteLoading(false);
    }
  };

  const openEditModal = (t: Testimonial) => {
    setEditItem(t);
    setDetailModalOpen(false);
    setModalOpen(true);
  };

  const openDetailModal = async (id: string) => {
    setDetailModalOpen(true);
    setDetailItem(null);
    setDetailLoading(true);
    try {
      const res = await getTestimonial(id);
      setDetailItem(res.data);
    } catch (err) {
      setDetailItem(null);
      setResponseModal({
        type: "error",
        title: "Error",
        message: getApiErrorMessage(err, "Failed to load testimonial details."),
      });
    } finally {
      setDetailLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="bg-white rounded-lg sm:rounded-xl shadow-md border border-[#BFC9D1]/50 overflow-hidden min-w-0 w-full">
        <div className="p-4 sm:p-6 lg:p-6 xl:p-8 border-b border-[#BFC9D1]/50">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4 lg:gap-4 xl:gap-6">
            <h2 className="text-lg sm:text-xl lg:text-xl xl:text-2xl font-semibold text-[#25343F]">Testimonials</h2>
            <button
              onClick={() => { setEditItem(null); setModalOpen(true); }}
              className="w-full sm:w-auto px-4 py-2.5 sm:py-2 lg:px-5 lg:py-2.5 xl:px-6 xl:py-3 rounded-lg bg-[#25343F] text-white hover:bg-[#25343F]/90 transition font-medium text-sm sm:text-base lg:text-base xl:text-lg"
            >
              Add Testimonial
            </button>
          </div>
        </div>

        {loading ? (
          <div className="p-6 sm:p-12 text-center text-[#25343F]/70 text-sm sm:text-base">
            Loading testimonials...
          </div>
        ) : testimonials.length === 0 ? (
          <div className="p-6 sm:p-12 text-center text-[#25343F]/70 text-sm sm:text-base">
            No testimonials yet. Add your first one.
          </div>
        ) : (
          <>
            {/* One layout only: cards below 1024px, table from 1024px up */}
            {!showTableView ? (
              <div className="divide-y divide-[#BFC9D1]/30">
                {testimonials.map((item) => (
                  <div
                    key={item._id}
                    className="p-4 bg-[#FAFAFA] hover:bg-[#EAEFEF]/50 transition"
                  >
                    <div className="flex gap-3">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 rounded-full object-cover border-2 border-[#BFC9D1] shrink-0"
                        />
                      ) : (
                        <AvatarPlaceholder name={item.name} className="w-12 h-12 shrink-0" />
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-[#25343F] text-sm">
                          {item.name}
                          {item.isOwner && (
                            <span className="ml-1 text-xs bg-[#FF9B51] text-white px-1.5 py-0.5 rounded">Owner</span>
                          )}
                        </p>
                        <p className="text-[#25343F]/80 text-xs">{item.designation} {item.company && `· ${item.company}`}</p>
                      </div>
                    </div>
                    <p className="text-[#25343F]/80 text-xs mt-2 overflow-hidden max-h-12">{item.testimonial}</p>
                    <p className="text-[#25343F]/60 text-xs mt-2">{formatDate(item.createdAt)}</p>
                    <button
                      onClick={() => openDetailModal(item._id)}
                      className="w-full mt-3 py-2 rounded-lg bg-[#25343F] text-white text-sm font-medium"
                    >
                      View
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="table-scroll-wrap">
                <table className="w-full min-w-[1100px] text-left border-collapse table-auto">
                  <thead>
                    <tr className="bg-[#EAEFEF] border-b border-[#BFC9D1]">
                      <th className="px-3 py-2 sm:px-4 sm:py-3 text-sm font-semibold text-[#25343F] text-left">Image</th>
                      <th className="px-3 py-2 sm:px-4 sm:py-3 text-sm font-semibold text-[#25343F] text-left">Name</th>
                      <th className="px-3 py-2 sm:px-4 sm:py-3 text-sm font-semibold text-[#25343F] text-left">Designation</th>
                      <th className="px-3 py-2 sm:px-4 sm:py-3 text-sm font-semibold text-[#25343F] text-left">Company</th>
                      <th className="px-3 py-2 sm:px-4 sm:py-3 text-sm font-semibold text-[#25343F] text-left">Testimonial</th>
                      <th className="px-3 py-2 sm:px-4 sm:py-3 text-sm font-semibold text-[#25343F] text-left whitespace-nowrap">Date</th>
                      <th className="px-3 py-2 sm:px-4 sm:py-3 pr-6 text-sm font-semibold text-[#25343F] text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {testimonials.map((item) => (
                      <tr key={item._id} className="border-b border-[#BFC9D1]/30 hover:bg-[#EAEFEF]/50 transition">
                        <td className="px-3 py-2 sm:px-4 sm:py-3">
                          {item.image ? (
                            <img src={item.image} alt={item.name} className="w-10 h-10 rounded-full object-cover border-2 border-[#BFC9D1]" />
                          ) : (
                            <AvatarPlaceholder name={item.name} className="w-10 h-10" />
                          )}
                        </td>
                        <td className="px-3 py-2 sm:px-4 sm:py-3 align-top whitespace-nowrap">
                          <span className="flex items-center gap-1">
                            <span className="font-medium text-[#25343F] text-sm">{item.name}</span>
                            {item.isOwner && <span className="shrink-0 text-xs bg-[#FF9B51] text-white px-1.5 py-0.5 rounded">Owner</span>}
                          </span>
                        </td>
                        <td className="px-3 py-2 sm:px-4 sm:py-3 align-top whitespace-nowrap">
                          <span className="text-[#25343F]/80 text-sm">{item.designation ?? "—"}</span>
                        </td>
                        <td className="px-3 py-2 sm:px-4 sm:py-3 align-top whitespace-nowrap">
                          <span className="text-[#25343F]/80 text-sm">{item.company ?? "—"}</span>
                        </td>
                        <td className="px-3 py-2 sm:px-4 sm:py-3 align-top whitespace-nowrap max-w-[240px]">
                          <span className="block truncate text-[#25343F]/80 text-sm" title={item.testimonial}>{truncateText(item.testimonial, 80)}</span>
                        </td>
                        <td className="px-3 py-2 sm:px-4 sm:py-3 text-sm text-[#25343F]/70 whitespace-nowrap">{formatDate(item.createdAt)}</td>
                        <td className="px-3 py-2 sm:px-4 sm:py-3 pr-6">
                          <button type="button" onClick={() => openDetailModal(item._id)} className="shrink-0 px-3 py-1.5 rounded-lg bg-[#25343F] text-white hover:bg-[#25343F]/90 text-sm font-medium whitespace-nowrap">
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
                totalPages={totalPages}
                onPageChange={setPage}
              />
            </div>
          </>
        )}
      </div>

      {modalOpen && (
        <TestimonialModal
          item={editItem}
          onClose={() => {
            setModalOpen(false);
            setEditItem(null);
            fetchTestimonials();
          }}
          onSuccess={(message) => {
            setResponseModal({
              type: "success",
              title: "Success",
              message,
            });
          }}
        />
      )}

      {detailModalOpen && (
        <TestimonialDetailModal
          item={detailItem}
          loading={detailLoading}
          onClose={() => {
            setDetailModalOpen(false);
            setDetailItem(null);
          }}
          onEdit={openEditModal}
          onDelete={(item) => {
            setDetailModalOpen(false);
            setDetailItem(null);
            setConfirmDelete(item);
          }}
        />
      )}

      {confirmDelete && (
        <ConfirmModal
          title="Delete Testimonial"
          message={`Are you sure you want to delete the testimonial from ${confirmDelete.name}? This action cannot be undone.`}
          confirmLabel={deleteLoading ? "Deleting..." : "Delete"}
          confirmDisabled={deleteLoading}
          variant="danger"
          onConfirm={() => handleDelete(confirmDelete)}
          onCancel={() => setConfirmDelete(null)}
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
