import { useEffect, useState } from "react";
import { AdminLayout } from "../../components/layout/AdminLayout";
import {
  getProjects,
  getProjectById,
  deleteProject,
} from "../../api/projectsApi";
import { type Project } from "../../types/project";
import { Pagination } from "../../components/ui/Pagination";
import { ProjectModal } from "./projectModal";
import { ProjectDetailModal } from "./projectDetailModal";
import { ProjectImagePlaceholder } from "../../components/ui/ProjectImagePlaceholder";
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

export const ProjectListPage = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<Project | null>(null);
  const [detailItem, setDetailItem] = useState<Project | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [responseModal, setResponseModal] = useState<{
    type: "success" | "error";
    title: string;
    message: string;
  } | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Project | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const showTableView = useMediaQuery(1024);

  const fetchProjects = async (): Promise<void> => {
    setLoading(true);
    try {
      const res = await getProjects(page, limit);
      setProjects(res.data);
      setTotal(res.pagination.total);
      setTotalPages(
        res.pagination.totalPages ??
          Math.max(1, Math.ceil(res.pagination.total / limit))
      );
    } catch (err) {
      setResponseModal({
        type: "error",
        title: "Error",
        message: getApiErrorMessage(err, "Failed to load projects."),
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const handleDelete = async (item: Project) => {
    setDeleteLoading(true);
    try {
      await deleteProject(item.id);
      setConfirmDelete(null);
      setResponseModal({
        type: "success",
        title: "Deleted",
        message: "Project deleted successfully.",
      });
      fetchProjects();
    } catch (err) {
      setResponseModal({
        type: "error",
        title: "Delete Failed",
        message: getApiErrorMessage(err, "Failed to delete project."),
      });
    } finally {
      setDeleteLoading(false);
    }
  };

  const openEditModal = (p: Project) => {
    setEditItem(p);
    setDetailModalOpen(false);
    setModalOpen(true);
  };

  const openDetailModal = async (id: string) => {
    setDetailModalOpen(true);
    setDetailItem(null);
    setDetailLoading(true);
    try {
      const res = await getProjectById(id);
      setDetailItem(res.data);
    } catch (err) {
      setDetailItem(null);
      setResponseModal({
        type: "error",
        title: "Error",
        message: getApiErrorMessage(err, "Failed to load project details."),
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
            <div>
              <h2 className="text-lg sm:text-xl lg:text-xl xl:text-2xl font-semibold text-[#25343F]">
                Projects
              </h2>
              <p className="text-sm sm:text-sm lg:text-base xl:text-base text-[#25343F]/70 mt-1">
                Portfolio projects shown on your site
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setEditItem(null);
                setModalOpen(true);
              }}
              className="w-full sm:w-auto px-4 py-2.5 sm:py-2 lg:px-5 lg:py-2.5 xl:px-6 xl:py-3 rounded-lg bg-[#25343F] text-white hover:bg-[#25343F]/90 transition font-medium text-sm sm:text-base lg:text-base xl:text-lg"
            >
              Add Project
            </button>
          </div>
        </div>

        {loading ? (
          <div className="p-6 sm:p-12 text-center text-[#25343F]/70 text-sm sm:text-base">
            Loading projects...
          </div>
        ) : projects.length === 0 ? (
          <div className="p-6 sm:p-12 text-center text-[#25343F]/70 text-sm sm:text-base">
            No projects yet. Add your first one.
          </div>
        ) : (
          <>
            {!showTableView ? (
              <div className="divide-y divide-[#BFC9D1]/30">
                {projects.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 bg-[#FAFAFA] hover:bg-[#EAEFEF]/50 transition"
                  >
                    <div className="flex gap-3">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-11 rounded-lg object-cover border-2 border-[#BFC9D1] shrink-0"
                        />
                      ) : (
                        <ProjectImagePlaceholder name={item.name} className="w-16 h-11" />
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-[#25343F] text-sm">{item.name}</p>
                        <div className="flex flex-wrap gap-1.5 mt-1">
                          {item.isPrivate && (
                            <span className="text-xs bg-[#25343F] text-white px-1.5 py-0.5 rounded">
                              Private
                            </span>
                          )}
                          <span
                            className={`text-xs px-1.5 py-0.5 rounded ${
                              item.isActive
                                ? "bg-green-600/20 text-green-800"
                                : "bg-red-600/20 text-red-800"
                            }`}
                          >
                            {item.isActive ? "Active" : "Inactive"}
                          </span>
                          <span className="text-xs text-[#25343F]/60">#{item.sortOrder}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-[#25343F]/80 text-xs mt-2 overflow-hidden max-h-12">
                      {item.description}
                    </p>
                    <p className="text-[#25343F]/60 text-xs mt-2">
                      {item.buttons.length} button{item.buttons.length !== 1 ? "s" : ""} ·{" "}
                      {formatDate(item.updatedAt)}
                    </p>
                    <button
                      type="button"
                      onClick={() => openDetailModal(item.id)}
                      className="w-full mt-3 py-2 rounded-lg bg-[#25343F] text-white text-sm font-medium"
                    >
                      View
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="table-scroll-wrap">
                <table className="w-full min-w-[1000px] text-left border-collapse table-auto">
                  <thead>
                    <tr className="bg-[#EAEFEF] border-b border-[#BFC9D1]">
                      <th className="px-3 py-2 sm:px-4 sm:py-3 text-sm font-semibold text-[#25343F] text-left">
                        Image
                      </th>
                      <th className="px-3 py-2 sm:px-4 sm:py-3 text-sm font-semibold text-[#25343F] text-left">
                        Name
                      </th>
                      <th className="px-3 py-2 sm:px-4 sm:py-3 text-sm font-semibold text-[#25343F] text-left">
                        Description
                      </th>
                      <th className="px-3 py-2 sm:px-4 sm:py-3 text-sm font-semibold text-[#25343F] text-left whitespace-nowrap">
                        Order
                      </th>
                      <th className="px-3 py-2 sm:px-4 sm:py-3 text-sm font-semibold text-[#25343F] text-left whitespace-nowrap">
                        Status
                      </th>
                      <th className="px-3 py-2 sm:px-4 sm:py-3 text-sm font-semibold text-[#25343F] text-left whitespace-nowrap">
                        Updated
                      </th>
                      <th className="px-3 py-2 sm:px-4 sm:py-3 pr-6 text-sm font-semibold text-[#25343F] text-left">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {projects.map((item) => (
                      <tr
                        key={item.id}
                        className="border-b border-[#BFC9D1]/30 hover:bg-[#EAEFEF]/50 transition"
                      >
                        <td className="px-3 py-2 sm:px-4 sm:py-3">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-14 h-10 rounded-lg object-cover border-2 border-[#BFC9D1]"
                            />
                          ) : (
                            <ProjectImagePlaceholder name={item.name} className="w-14 h-10" />
                          )}
                        </td>
                        <td className="px-3 py-2 sm:px-4 sm:py-3 align-top whitespace-nowrap">
                          <span className="font-medium text-[#25343F] text-sm">{item.name}</span>
                          {item.isPrivate && (
                            <span className="ml-1 text-xs bg-[#25343F] text-white px-1.5 py-0.5 rounded">
                              Private
                            </span>
                          )}
                        </td>
                        <td className="px-3 py-2 sm:px-4 sm:py-3 align-top max-w-[280px]">
                          <span
                            className="block truncate text-[#25343F]/80 text-sm"
                            title={item.description}
                          >
                            {truncateText(item.description, 80)}
                          </span>
                        </td>
                        <td className="px-3 py-2 sm:px-4 sm:py-3 text-sm text-[#25343F]/80 whitespace-nowrap align-top">
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
                        <td className="px-3 py-2 sm:px-4 sm:py-3 text-sm text-[#25343F]/70 whitespace-nowrap align-top">
                          {formatDate(item.updatedAt)}
                        </td>
                        <td className="px-3 py-2 sm:px-4 sm:py-3 pr-6 align-top">
                          <button
                            type="button"
                            onClick={() => openDetailModal(item.id)}
                            className="shrink-0 px-3 py-1.5 rounded-lg bg-[#25343F] text-white hover:bg-[#25343F]/90 text-sm font-medium whitespace-nowrap"
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
        <ProjectModal
          item={editItem}
          onClose={() => {
            setModalOpen(false);
            setEditItem(null);
            fetchProjects();
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
        <ProjectDetailModal
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
          title="Delete Project"
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
