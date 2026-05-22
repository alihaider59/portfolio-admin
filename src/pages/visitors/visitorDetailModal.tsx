import { type Visitor } from "../../types/visitor";
import { DetailModal } from "../../components/ui/DetailModal";

interface Props {
  item: Visitor | null;
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

export const VisitorDetailModal = ({ item, loading, onClose }: Props) => (
  <DetailModal title="Visitor Details" onClose={onClose}>
    {loading ? (
      <div className="py-8 text-center text-[#17153B]/70">Loading...</div>
    ) : !item ? (
      <div className="py-8 text-center text-red-600">Failed to load visitor.</div>
    ) : (
      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-medium text-[#17153B]/70 mb-1">IP Address</h4>
          <p className="text-[#17153B] font-mono font-medium">{item.ipAddress}</p>
        </div>

        <div>
          <h4 className="text-sm font-medium text-[#17153B]/70 mb-1">Total Visits</h4>
          <p className="text-2xl font-bold text-[#C8ACD6]">{item.visits}</p>
        </div>

        <div>
          <h4 className="text-sm font-medium text-[#17153B]/70 mb-1">First Visit</h4>
          <p className="text-[#17153B]/90">{formatDate(item.createdAt)}</p>
        </div>

        <div>
          <h4 className="text-sm font-medium text-[#17153B]/70 mb-1">Last Seen</h4>
          <p className="text-[#17153B]/90">{formatDate(item.updatedAt)}</p>
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
