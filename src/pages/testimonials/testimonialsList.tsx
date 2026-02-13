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

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

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
      <div className="bg-white rounded-xl shadow-md border border-[#BFC9D1]/50 overflow-hidden">
        <div className="p-6 border-b border-[#BFC9D1]/50">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <h2 className="text-xl font-semibold text-[#25343F]">Testimonials</h2>
            <button
              onClick={() => {
                setEditItem(null);
                setModalOpen(true);
              }}
              className="px-4 py-2 rounded-lg bg-[#25343F] text-white hover:bg-[#25343F]/90 transition font-medium"
            >
              Add Testimonial
            </button>
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center text-[#25343F]/70">
            Loading testimonials...
          </div>
        ) : testimonials.length === 0 ? (
          <div className="p-12 text-center text-[#25343F]/70">
            No testimonials yet. Add your first one.
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-[#EAEFEF] border-b border-[#BFC9D1]">
                    <th className="px-4 py-3 text-sm font-semibold text-[#25343F]">Image</th>
                    <th className="px-4 py-3 text-sm font-semibold text-[#25343F]">Name</th>
                    <th className="px-4 py-3 text-sm font-semibold text-[#25343F]">Designation</th>
                    <th className="px-4 py-3 text-sm font-semibold text-[#25343F]">Company</th>
                    <th className="px-4 py-3 text-sm font-semibold text-[#25343F]">Testimonial</th>
                    <th className="px-4 py-3 text-sm font-semibold text-[#25343F]">Date</th>
                    <th className="px-4 py-3 text-sm font-semibold text-[#25343F]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {testimonials.map((item) => (
                    <tr
                      key={item._id}
                      className="border-b border-[#BFC9D1]/30 hover:bg-[#EAEFEF]/50 transition"
                    >
                      <td className="px-4 py-3">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-12 h-12 rounded-full object-cover border-2 border-[#BFC9D1]"
                          />
                        ) : (
                          <AvatarPlaceholder name={item.name} className="w-12 h-12" />
                        )}
                      </td>
                      <td className="px-4 py-3 font-medium text-[#25343F]">
                        {item.name}
                        {item.isOwner && (
                          <span className="ml-2 text-xs bg-[#FF9B51] text-white px-2 py-0.5 rounded">
                            Owner
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-[#25343F]/80">{item.designation}</td>
                      <td className="px-4 py-3 text-[#25343F]/80">{item.company}</td>
                      <td className="px-4 py-3 max-w-xs truncate text-[#25343F]/80">
                        {item.testimonial}
                      </td>
                      <td className="px-4 py-3 text-sm text-[#25343F]/70">
                        {formatDate(item.createdAt)}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => openDetailModal(item._id)}
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
