import { useEffect, useState } from "react";
import { AdminLayout } from "../../components/layout/AdminLayout";
import { getContacts, getContactById, deleteContacts } from "../../api/contactApi";
import { type Contact } from "../../types/contact";
import { Pagination } from "../../components/ui/Pagination";
import { ContactDetailModal } from "./contactDetailModal";
import { ResponseModal } from "../../components/ui/ResponseModal";
import { ConfirmModal } from "../../components/ui/ConfirmModal";
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

export const ContactListPage = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [detailItem, setDetailItem] = useState<Contact | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [responseModal, setResponseModal] = useState<{
    type: "success" | "error";
    title: string;
    message: string;
  } | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Contact | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const showTableView = useMediaQuery(1024);

  const fetchContacts = async (): Promise<void> => {
    setLoading(true);
    try {
      const res = await getContacts(page, limit);
      setContacts(res.data);
      setTotal(res.pagination.total);
    } catch (err) {
      setResponseModal({
        type: "error",
        title: "Error",
        message: getApiErrorMessage(err, "Failed to load contacts."),
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const handleDelete = async (contact: Contact) => {
    setDeleteLoading(true);
    try {
      await deleteContacts([contact._id]);
      setConfirmDelete(null);
      setResponseModal({
        type: "success",
        title: "Deleted",
        message: "Contact deleted successfully.",
      });
      fetchContacts();
    } catch (err) {
      setResponseModal({
        type: "error",
        title: "Delete Failed",
        message: getApiErrorMessage(err, "Failed to delete contact."),
      });
    } finally {
      setDeleteLoading(false);
    }
  };

  const openDetailModal = async (id: string) => {
    setDetailModalOpen(true);
    setDetailItem(null);
    setDetailLoading(true);
    try {
      const res = await getContactById(id);
      setDetailItem(res.data);
    } catch (err) {
      setDetailItem(null);
      setResponseModal({
        type: "error",
        title: "Error",
        message: getApiErrorMessage(err, "Failed to load contact details."),
      });
    } finally {
      setDetailLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="bg-white rounded-lg sm:rounded-xl shadow-md border border-[#BFC9D1]/50 overflow-hidden min-w-0 w-full">
        <div className="p-4 sm:p-6 lg:p-6 xl:p-8 border-b border-[#BFC9D1]/50">
          <h2 className="text-lg sm:text-xl lg:text-xl xl:text-2xl font-semibold text-[#25343F]">Contacts</h2>
          <p className="text-sm sm:text-sm lg:text-base xl:text-base text-[#25343F]/70 mt-1">
            Contact form submissions
          </p>
        </div>

        {loading ? (
          <div className="p-6 sm:p-12 text-center text-[#25343F]/70 text-sm sm:text-base">Loading contacts...</div>
        ) : contacts.length === 0 ? (
          <div className="p-6 sm:p-12 text-center text-[#25343F]/70 text-sm sm:text-base">No contacts yet.</div>
        ) : (
          <>
            {/* One layout only: cards below 1024px, table from 1024px up */}
            {!showTableView ? (
              <div className="divide-y divide-[#BFC9D1]/30">
                {contacts.map((contact) => (
                  <div
                    key={contact._id}
                    className="p-4 bg-[#FAFAFA] hover:bg-[#EAEFEF]/50 transition"
                  >
                    <p className="font-medium text-[#25343F] text-sm truncate">{contact.name}</p>
                    <a
                      href={`mailto:${contact.email}`}
                      className="text-[#FF9B51] hover:underline text-xs sm:text-sm break-all block mt-0.5"
                    >
                      {contact.email}
                    </a>
                    <p className="text-[#25343F]/80 text-xs mt-1 overflow-hidden max-h-10 sm:max-h-none sm:truncate">
                      {contact.message}
                    </p>
                    <p className="text-[#25343F]/60 text-xs mt-2">{formatDate(contact.createdAt)}</p>
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => openDetailModal(contact._id)}
                        className="flex-1 py-2 rounded-lg bg-[#25343F] text-white text-sm font-medium"
                      >
                        View
                      </button>
                      <button
                        onClick={() => setConfirmDelete(contact)}
                        className="flex-1 py-2 rounded-lg bg-red-600 text-white text-sm font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="table-scroll-wrap">
                <table className="w-full min-w-[960px] text-left border-collapse table-auto">
                  <thead>
                    <tr className="bg-[#EAEFEF] border-b border-[#BFC9D1]">
                      <th className="px-3 py-2 sm:px-4 sm:py-3 text-sm font-semibold text-[#25343F] text-left">Name</th>
                      <th className="px-3 py-2 sm:px-4 sm:py-3 text-sm font-semibold text-[#25343F] text-left">Email</th>
                      <th className="px-3 py-2 sm:px-4 sm:py-3 text-sm font-semibold text-[#25343F] text-left">Message</th>
                      <th className="px-3 py-2 sm:px-4 sm:py-3 text-sm font-semibold text-[#25343F] text-left whitespace-nowrap">Date</th>
                      <th className="px-3 py-2 sm:px-4 sm:py-3 pr-6 text-sm font-semibold text-[#25343F] text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contacts.map((contact) => (
                      <tr
                        key={contact._id}
                        className="border-b border-[#BFC9D1]/30 hover:bg-[#EAEFEF]/50 transition"
                      >
                        <td className="px-3 py-2 sm:px-4 sm:py-3 align-top whitespace-nowrap">
                          <span className="font-medium text-[#25343F] text-sm">{contact.name}</span>
                        </td>
                        <td className="px-3 py-2 sm:px-4 sm:py-3 align-top whitespace-nowrap">
                          <a href={`mailto:${contact.email}`} className="text-[#FF9B51] hover:underline text-sm">{contact.email}</a>
                        </td>
                        <td className="px-3 py-2 sm:px-4 sm:py-3 align-top whitespace-nowrap max-w-[280px]">
                          <span className="block truncate text-[#25343F]/80 text-sm" title={contact.message}>
                            {contact.message.length > 60 ? `${contact.message.slice(0, 60)}...` : contact.message}
                          </span>
                        </td>
                        <td className="px-3 py-2 sm:px-4 sm:py-3 text-sm text-[#25343F]/70 whitespace-nowrap align-top">{formatDate(contact.createdAt)}</td>
                        <td className="px-3 py-2 sm:px-4 sm:py-3 pr-6 align-top">
                          <div className="flex gap-2">
                            <button type="button" onClick={() => openDetailModal(contact._id)} className="shrink-0 px-3 py-1.5 rounded-lg bg-[#25343F] text-white hover:bg-[#25343F]/90 text-sm font-medium whitespace-nowrap">
                              View
                            </button>
                            <button type="button" onClick={() => setConfirmDelete(contact)} className="shrink-0 px-3 py-1.5 rounded-lg bg-red-600 text-white hover:bg-red-700 text-sm font-medium whitespace-nowrap">
                              Delete
                            </button>
                          </div>
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
        <ContactDetailModal
          item={detailItem}
          loading={detailLoading}
          onClose={() => {
            setDetailModalOpen(false);
            setDetailItem(null);
          }}
        />
      )}

      {confirmDelete && (
        <ConfirmModal
          title="Delete Contact"
          message={`Are you sure you want to delete the contact from ${confirmDelete.name}? This action cannot be undone.`}
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
