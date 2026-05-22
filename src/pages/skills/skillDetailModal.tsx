import { type Skill } from "../../types/skill";
import { DetailModal } from "../../components/ui/DetailModal";
import { SkillIconPreview } from "../../components/ui/SkillIconPreview";

interface Props {
  item: Skill | null;
  loading: boolean;
  onClose: () => void;
  onEdit: (item: Skill) => void;
  onDelete: (item: Skill) => void;
}

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

export const SkillDetailModal = ({
  item,
  loading,
  onClose,
  onEdit,
  onDelete,
}: Props) => (
  <DetailModal title="Skill Details" onClose={onClose}>
    {loading ? (
      <div className="py-8 text-center text-[#17153B]/70">Loading...</div>
    ) : !item ? (
      <div className="py-8 text-center text-red-600">Failed to load skill.</div>
    ) : (
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <SkillIconPreview name={item.name} icon={item.icon} className="w-16 h-16 text-base" />
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-[#17153B] text-lg">{item.name}</h3>
            <div className="flex flex-wrap gap-2 mt-2">
              <span
                className={`text-xs px-2 py-0.5 rounded ${
                  item.isActive
                    ? "bg-green-600/20 text-green-800"
                    : "bg-red-600/20 text-red-800"
                }`}
              >
                {item.isActive ? "Active" : "Inactive"}
              </span>
              <span className="text-xs bg-[#C8ACD6]/20 text-[#17153B] px-2 py-0.5 rounded">
                Order: {item.sortOrder}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 text-sm text-[#17153B]/70">
          <span>Created: {formatDate(item.createdAt)}</span>
          <span>Updated: {formatDate(item.updatedAt)}</span>
        </div>

        <div className="flex flex-wrap justify-end gap-2 pt-4 border-t border-[#433D8B]">
          <button
            type="button"
            onClick={() => onEdit(item)}
            className="px-3 py-2 sm:px-4 rounded-lg bg-[#17153B] text-white hover:bg-[#17153B]/90 font-medium transition text-sm sm:text-base"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => onDelete(item)}
            className="px-3 py-2 sm:px-4 rounded-lg bg-red-600 text-white hover:bg-red-700 font-medium transition text-sm sm:text-base"
          >
            Delete
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-2 sm:px-4 rounded-lg bg-[#433D8B] text-[#17153B] hover:bg-[#433D8B]/80 font-medium transition text-sm sm:text-base"
          >
            Close
          </button>
        </div>
      </div>
    )}
  </DetailModal>
);
