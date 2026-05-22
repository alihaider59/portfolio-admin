import { type Contact } from "../../types/contact";
import { DetailModal } from "../../components/ui/DetailModal";

interface Props {
  item: Contact | null;
  loading: boolean;
  onClose: () => void;
}

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

export const ContactDetailModal = ({ item, loading, onClose }: Props) => (
  <DetailModal title="Contact Details" onClose={onClose}>
    {loading ? (
      <div className="py-8 text-center text-[#17153B]/70">Loading...</div>
    ) : !item ? (
      <div className="py-8 text-center text-red-600">Failed to load contact.</div>
    ) : (
      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-medium text-[#17153B]/70 mb-1">Name</h4>
          <p className="text-[#17153B] font-medium">{item.name}</p>
        </div>

        <div>
          <h4 className="text-sm font-medium text-[#17153B]/70 mb-1">Email</h4>
          <a
            href={`mailto:${item.email}`}
            className="text-[#C8ACD6] hover:underline"
          >
            {item.email}
          </a>
        </div>

        <div>
          <h4 className="text-sm font-medium text-[#17153B]/70 mb-1">Message</h4>
          <p className="text-[#17153B]/90 leading-relaxed bg-[#F0EBF5] p-4 rounded-lg whitespace-pre-wrap">
            {item.message}
          </p>
        </div>

        {item.ipAddress && (
          <div>
            <h4 className="text-sm font-medium text-[#17153B]/70 mb-1">IP Address</h4>
            <p className="text-[#17153B]/80 font-mono text-sm">{item.ipAddress}</p>
          </div>
        )}

        <div className="text-sm text-[#17153B]/70">
          <span>Received: {formatDate(item.createdAt)}</span>
        </div>

        <div className="flex justify-end pt-4 border-t border-[#433D8B]">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 rounded-lg bg-[#17153B] text-white hover:bg-[#17153B]/90 font-medium transition text-sm sm:text-base"
          >
            Close
          </button>
        </div>
      </div>
    )}
  </DetailModal>
);
