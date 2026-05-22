import { type Experience } from "../../types/experience";
import { DetailModal } from "../../components/ui/DetailModal";
import { ExperienceIconPreview } from "../../components/ui/ExperienceIconPreview";

interface Props {
  item: Experience | null;
  loading: boolean;
  onClose: () => void;
  onEdit: (item: Experience) => void;
  onDelete: (item: Experience) => void;
}

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

export const ExperienceDetailModal = ({
  item,
  loading,
  onClose,
  onEdit,
  onDelete,
}: Props) => (
  <DetailModal title="Experience Details" onClose={onClose}>
    {loading ? (
      <div className="py-8 text-center text-[#17153B]/70">Loading...</div>
    ) : !item ? (
      <div className="py-8 text-center text-red-600">Failed to load experience.</div>
    ) : (
      <div className="space-y-4">
        <div className="flex items-start gap-4">
          <ExperienceIconPreview
            companyName={item.companyName}
            icon={item.icon}
            iconBg={item.iconBg}
            className="w-16 h-16 min-w-[4rem] min-h-[4rem]"
            variant="rounded"
          />
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-[#17153B] text-lg">{item.title}</h3>
            <p className="text-[#17153B]/80 text-sm mt-0.5">{item.companyName}</p>
            <p className="text-[#C8ACD6] text-sm mt-1">{item.date}</p>
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
              <span className="text-xs bg-[#433D8B]/50 text-[#17153B] px-2 py-0.5 rounded font-mono">
                {item.iconBg}
              </span>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-[#17153B] mb-2">Responsibilities & achievements</h4>
          {item.points.length === 0 ? (
            <p className="text-sm text-[#17153B]/70">No bullet points.</p>
          ) : (
            <ul className="list-disc list-inside space-y-2 bg-white/60 p-4 rounded-lg text-sm text-[#17153B]/90">
              {item.points.map((point, i) => (
                <li key={i} className="leading-relaxed">
                  {point}
                </li>
              ))}
            </ul>
          )}
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
