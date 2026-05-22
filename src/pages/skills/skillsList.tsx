import { useEffect, useMemo, useState } from "react";
import { AdminLayout } from "../../components/layout/AdminLayout";
import { getSkills, getSkillById, deleteSkill } from "../../api/skillsApi";
import { type Skill } from "../../types/skill";
import { Pagination } from "../../components/ui/Pagination";
import { SkillModal } from "./skillModal";
import { SkillDetailModal } from "./skillDetailModal";
import { SkillIconPreview } from "../../components/ui/SkillIconPreview";
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

export const SkillListPage = () => {
  const [allSkills, setAllSkills] = useState<Skill[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<Skill | null>(null);
  const [detailItem, setDetailItem] = useState<Skill | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [responseModal, setResponseModal] = useState<{
    type: "success" | "error";
    title: string;
    message: string;
  } | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Skill | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const showTableView = useMediaQuery(1024);

  const total = allSkills.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  const skills = useMemo(() => {
    const start = (page - 1) * limit;
    return allSkills.slice(start, start + limit);
  }, [allSkills, page, limit]);

  const fetchSkills = async (): Promise<void> => {
    setLoading(true);
    try {
      const res = await getSkills();
      const sorted = [...res.data].sort((a, b) => a.sortOrder - b.sortOrder);
      setAllSkills(sorted);
      setPage(1);
    } catch (err) {
      setResponseModal({
        type: "error",
        title: "Error",
        message: getApiErrorMessage(err, "Failed to load skills."),
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const handleDelete = async (item: Skill) => {
    setDeleteLoading(true);
    try {
      await deleteSkill(item.id);
      setConfirmDelete(null);
      setResponseModal({
        type: "success",
        title: "Deleted",
        message: "Skill deleted successfully.",
      });
      fetchSkills();
    } catch (err) {
      setResponseModal({
        type: "error",
        title: "Delete Failed",
        message: getApiErrorMessage(err, "Failed to delete skill."),
      });
    } finally {
      setDeleteLoading(false);
    }
  };

  const openEditModal = (item: Skill) => {
    setEditItem(item);
    setDetailModalOpen(false);
    setModalOpen(true);
  };

  const openDetailModal = async (id: string) => {
    setDetailModalOpen(true);
    setDetailItem(null);
    setDetailLoading(true);
    try {
      const res = await getSkillById(id);
      setDetailItem(res.data);
    } catch (err) {
      setDetailItem(null);
      setResponseModal({
        type: "error",
        title: "Error",
        message: getApiErrorMessage(err, "Failed to load skill details."),
      });
    } finally {
      setDetailLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="bg-white rounded-lg sm:rounded-xl shadow-md border border-[#433D8B]/50 overflow-hidden min-w-0 w-full">
        <div className="p-4 sm:p-6 lg:p-6 xl:p-8 border-b border-[#433D8B]/50">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4 lg:gap-4 xl:gap-6">
            <div>
              <h2 className="text-lg sm:text-xl lg:text-xl xl:text-2xl font-semibold text-[#17153B]">
                Skills
              </h2>
              <p className="text-sm sm:text-sm lg:text-base xl:text-base text-[#17153B]/70 mt-1">
                Technologies and tools on your portfolio
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setEditItem(null);
                setModalOpen(true);
              }}
              className="w-full sm:w-auto px-4 py-2.5 sm:py-2 lg:px-5 lg:py-2.5 xl:px-6 xl:py-3 rounded-lg bg-[#17153B] text-white hover:bg-[#17153B]/90 transition font-medium text-sm sm:text-base lg:text-base xl:text-lg"
            >
              Add Skill
            </button>
          </div>
        </div>

        {loading ? (
          <div className="p-6 sm:p-12 text-center text-[#17153B]/70 text-sm sm:text-base">
            Loading skills...
          </div>
        ) : allSkills.length === 0 ? (
          <div className="p-6 sm:p-12 text-center text-[#17153B]/70 text-sm sm:text-base">
            No skills yet. Add your first one.
          </div>
        ) : (
          <>
            {!showTableView ? (
              <div className="divide-y divide-[#433D8B]/30">
                {skills.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 bg-[#FAFAFA] hover:bg-[#F0EBF5]/50 transition"
                  >
                    <div className="flex gap-3 items-center">
                      <SkillIconPreview name={item.name} icon={item.icon} className="w-12 h-12" />
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-[#17153B] text-sm">{item.name}</p>
                        <div className="flex flex-wrap gap-1.5 mt-1">
                          <span
                            className={`text-xs px-1.5 py-0.5 rounded ${
                              item.isActive
                                ? "bg-green-600/20 text-green-800"
                                : "bg-red-600/20 text-red-800"
                            }`}
                          >
                            {item.isActive ? "Active" : "Inactive"}
                          </span>
                          <span className="text-xs text-[#17153B]/60">#{item.sortOrder}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-[#17153B]/60 text-xs mt-2">
                      Updated {formatDate(item.updatedAt)}
                    </p>
                    <button
                      type="button"
                      onClick={() => openDetailModal(item.id)}
                      className="w-full mt-3 py-2 rounded-lg bg-[#17153B] text-white text-sm font-medium"
                    >
                      View
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="table-scroll-wrap">
                <table className="w-full min-w-[720px] text-left border-collapse table-auto">
                  <thead>
                    <tr className="bg-[#F0EBF5] border-b border-[#433D8B]">
                      <th className="px-3 py-2 sm:px-4 sm:py-3 text-sm font-semibold text-[#17153B] text-left">
                        Icon
                      </th>
                      <th className="px-3 py-2 sm:px-4 sm:py-3 text-sm font-semibold text-[#17153B] text-left">
                        Name
                      </th>
                      <th className="px-3 py-2 sm:px-4 sm:py-3 text-sm font-semibold text-[#17153B] text-left whitespace-nowrap">
                        Order
                      </th>
                      <th className="px-3 py-2 sm:px-4 sm:py-3 text-sm font-semibold text-[#17153B] text-left whitespace-nowrap">
                        Status
                      </th>
                      <th className="px-3 py-2 sm:px-4 sm:py-3 text-sm font-semibold text-[#17153B] text-left whitespace-nowrap">
                        Updated
                      </th>
                      <th className="px-3 py-2 sm:px-4 sm:py-3 pr-6 text-sm font-semibold text-[#17153B] text-left">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {skills.map((item) => (
                      <tr
                        key={item.id}
                        className="border-b border-[#433D8B]/30 hover:bg-[#F0EBF5]/50 transition"
                      >
                        <td className="px-3 py-2 sm:px-4 sm:py-3">
                          <SkillIconPreview name={item.name} icon={item.icon} className="w-10 h-10" />
                        </td>
                        <td className="px-3 py-2 sm:px-4 sm:py-3 align-top whitespace-nowrap">
                          <span className="font-medium text-[#17153B] text-sm">{item.name}</span>
                        </td>
                        <td className="px-3 py-2 sm:px-4 sm:py-3 text-sm text-[#17153B]/80 whitespace-nowrap align-top">
                          {item.sortOrder}
                        </td>
                        <td className="px-3 py-2 sm:px-4 sm:py-3 align-top whitespace-nowrap">
                          <span
                            className={`text-xs px-2 py-0.5 rounded ${
                              item.isActive
                                ? "bg-green-600/20 text-green-800"
                                : "bg-red-600/20 text-red-800"
                            }`}
                          >
                            {item.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="px-3 py-2 sm:px-4 sm:py-3 text-sm text-[#17153B]/70 whitespace-nowrap align-top">
                          {formatDate(item.updatedAt)}
                        </td>
                        <td className="px-3 py-2 sm:px-4 sm:py-3 pr-6 align-top">
                          <button
                            type="button"
                            onClick={() => openDetailModal(item.id)}
                            className="shrink-0 px-3 py-1.5 rounded-lg bg-[#17153B] text-white hover:bg-[#17153B]/90 text-sm font-medium whitespace-nowrap"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="p-4 sm:p-4 lg:p-5 xl:p-6 border-t border-[#433D8B]/50">
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
        <SkillModal
          item={editItem}
          onClose={() => {
            setModalOpen(false);
            setEditItem(null);
            fetchSkills();
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
        <SkillDetailModal
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
          title="Delete Skill"
          message={`Are you sure you want to delete "${confirmDelete.name}"? This action cannot be undone.`}
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
