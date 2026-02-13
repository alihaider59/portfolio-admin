import { useEffect, useState } from "react";
import { AdminLayout } from "../../components/layout/AdminLayout";
import { getContacts, getContactById, deleteContacts } from "../../api/contactApi";
import { type Contact } from "../../types/contact";
import { Pagination } from "../../components/ui/Pagination";
import { ContactDetailModal } from "./contactDetailModal";
import { ResponseModal } from "../../components/ui/ResponseModal";
import { ConfirmModal } from "../../components/ui/ConfirmModal";
import { getApiErrorMessage } from "../../utils/apiError";

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
      <div className="bg-white rounded-xl shadow-md border border-[#BFC9D1]/50 overflow-hidden">
        <div className="p-6 border-b border-[#BFC9D1]/50">
          <h2 className="text-xl font-semibold text-[#25343F]">Contacts</h2>
          <p className="text-sm text-[#25343F]/70 mt-1">
            Contact form submissions
          </p>
        </div>

        {loading ? (
          <div className="p-12 text-center text-[#25343F]/70">Loading contacts...</div>
        ) : contacts.length === 0 ? (
          <div className="p-12 text-center text-[#25343F]/70">No contacts yet.</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-[#EAEFEF] border-b border-[#BFC9D1]">
                    <th className="px-4 py-3 text-sm font-semibold text-[#25343F]">Name</th>
                    <th className="px-4 py-3 text-sm font-semibold text-[#25343F]">Email</th>
                    <th className="px-4 py-3 text-sm font-semibold text-[#25343F]">Message</th>
                    <th className="px-4 py-3 text-sm font-semibold text-[#25343F]">Date</th>
                    <th className="px-4 py-3 text-sm font-semibold text-[#25343F]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {contacts.map((contact) => (
                    <tr
                      key={contact._id}
                      className="border-b border-[#BFC9D1]/30 hover:bg-[#EAEFEF]/50 transition"
                    >
                      <td className="px-4 py-3 font-medium text-[#25343F]">
                        {contact.name}
                      </td>
                      <td className="px-4 py-3">
                        <a
                          href={`mailto:${contact.email}`}
                          className="text-[#FF9B51] hover:underline"
                        >
                          {contact.email}
                        </a>
                      </td>
                      <td className="px-4 py-3 max-w-xs truncate text-[#25343F]/80">
                        {contact.message}
                      </td>
                      <td className="px-4 py-3 text-sm text-[#25343F]/70">
                        {formatDate(contact.createdAt)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => openDetailModal(contact._id)}
                            className="px-3 py-1.5 rounded-lg bg-[#25343F] text-white hover:bg-[#25343F]/90 text-sm font-medium transition"
                          >
                            View
                          </button>
                          <button
                            onClick={() => setConfirmDelete(contact)}
                            className="px-3 py-1.5 rounded-lg bg-red-600 text-white hover:bg-red-700 text-sm font-medium transition"
                          >
                            Delete
                          </button>
                        </div>
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
