import { type Project } from "../../types/project";
import { DetailModal } from "../../components/ui/DetailModal";
import { ProjectImagePlaceholder } from "../../components/ui/ProjectImagePlaceholder";

interface Props {
  item: Project | null;
  loading: boolean;
  onClose: () => void;
  onEdit: (item: Project) => void;
  onDelete: (item: Project) => void;
}

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

export const ProjectDetailModal = ({
  item,
  loading,
  onClose,
  onEdit,
  onDelete,
}: Props) => (
  <DetailModal title="Project Details" onClose={onClose}>
    {loading ? (
      <div className="py-8 text-center text-[#25343F]/70">Loading...</div>
    ) : !item ? (
      <div className="py-8 text-center text-red-600">Failed to load project.</div>
    ) : (
      <div className="space-y-4">
        <div className="flex items-start gap-4">
          {item.image ? (
            <img
              src={item.image}
              alt={item.name}
              className="w-24 h-16 rounded-lg object-cover border-2 border-[#BFC9D1] shrink-0"
            />
          ) : (
            <ProjectImagePlaceholder name={item.name} className="w-24 h-16 text-base" />
          )}
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-[#25343F] text-lg">{item.name}</h3>
            <div className="flex flex-wrap gap-2 mt-2">
              {item.isPrivate && (
                <span className="text-xs bg-[#25343F] text-white px-2 py-0.5 rounded">Private</span>
              )}
              <span
                className={`text-xs px-2 py-0.5 rounded ${
                  item.isActive
                    ? "bg-green-600/20 text-green-800"
                    : "bg-red-600/20 text-red-800"
                }`}
              >
                {item.isActive ? "Active" : "Inactive"}
              </span>
              <span className="text-xs bg-[#FF9B51]/20 text-[#25343F] px-2 py-0.5 rounded">
                Order: {item.sortOrder}
              </span>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-[#25343F] mb-2">Description</h4>
          <p className="text-[#25343F]/90 leading-relaxed bg-white/60 p-4 rounded-lg text-sm">
            {item.description}
          </p>
        </div>

        <div>
          <h4 className="text-sm font-medium text-[#25343F] mb-2">Buttons</h4>
          {item.buttons.length === 0 ? (
            <p className="text-sm text-[#25343F]/70">No buttons configured.</p>
          ) : (
            <ul className="space-y-2">
              {item.buttons.map((btn, i) => (
                <li
                  key={`${btn.label}-${i}`}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 p-3 bg-white/60 rounded-lg text-sm"
                >
                  <span className="font-medium text-[#25343F]">{btn.label}</span>
                  {btn.disabled ? (
                    <span className="text-xs text-[#25343F]/60">Disabled</span>
                  ) : btn.link ? (
                    <a
                      href={btn.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#FF9B51] hover:underline text-xs sm:text-sm break-all"
                    >
                      {btn.link}
                    </a>
                  ) : (
                    <span className="text-xs text-[#25343F]/60">No link</span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 text-sm text-[#25343F]/70">
          <span>Created: {formatDate(item.createdAt)}</span>
          <span>Updated: {formatDate(item.updatedAt)}</span>
        </div>

        <div className="flex flex-wrap justify-end gap-2 pt-4 border-t border-[#BFC9D1]">
          <button
            type="button"
            onClick={() => onEdit(item)}
            className="px-3 py-2 sm:px-4 rounded-lg bg-[#25343F] text-white hover:bg-[#25343F]/90 font-medium transition text-sm sm:text-base"
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
            className="px-3 py-2 sm:px-4 rounded-lg bg-[#BFC9D1] text-[#25343F] hover:bg-[#BFC9D1]/80 font-medium transition text-sm sm:text-base"
          >
            Close
          </button>
        </div>
      </div>
    )}
  </DetailModal>
);
