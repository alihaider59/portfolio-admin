import { type Testimonial } from "../../types/testimonial";
import { DetailModal } from "../../components/ui/DetailModal";
import { AvatarPlaceholder } from "../../components/ui/AvatarPlaceholder";

interface Props {
  item: Testimonial | null;
  loading: boolean;
  onClose: () => void;
  onEdit: (item: Testimonial) => void;
  onDelete: (item: Testimonial) => void;
}

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

export const TestimonialDetailModal = ({
  item,
  loading,
  onClose,
  onEdit,
  onDelete,
}: Props) => (
  <DetailModal title="Testimonial Details" onClose={onClose}>
    {loading ? (
      <div className="py-8 text-center text-[#25343F]/70">Loading...</div>
    ) : !item ? (
      <div className="py-8 text-center text-red-600">Failed to load testimonial.</div>
    ) : (
      <div className="space-y-4">
        <div className="flex items-start gap-4">
          {item.image ? (
            <img
              src={item.image}
              alt={item.name}
              className="w-20 h-20 rounded-full object-cover border-2 border-[#BFC9D1] shrink-0"
            />
          ) : (
            <AvatarPlaceholder name={item.name} className="w-20 h-20 text-lg" />
          )}
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-[#25343F] text-lg">{item.name}</h3>
            {item.email && (
              <a
                href={`mailto:${item.email}`}
                className="text-[#FF9B51] hover:underline text-sm"
              >
                {item.email}
              </a>
            )}
            <p className="text-[#25343F]/80 text-sm mt-1">
              {item.designation}
              {item.company && ` at ${item.company}`}
            </p>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-[#25343F] mb-2">Testimonial</h4>
          <p className="text-[#25343F]/90 leading-relaxed bg-[#EAEFEF] p-4 rounded-lg">
            &ldquo;{item.testimonial}&rdquo;
          </p>
        </div>

        <div className="flex gap-4 text-sm text-[#25343F]/70">
          <span>Created: {formatDate(item.createdAt)}</span>
          <span>Updated: {formatDate(item.updatedAt)}</span>
        </div>

        <div className="flex flex-wrap justify-end gap-2 pt-4 border-t border-[#BFC9D1]">
          <button
            onClick={() => onEdit(item)}
            className="px-3 py-2 sm:px-4 rounded-lg bg-[#25343F] text-white hover:bg-[#25343F]/90 font-medium transition text-sm sm:text-base"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(item)}
            className="px-3 py-2 sm:px-4 rounded-lg bg-red-600 text-white hover:bg-red-700 font-medium transition text-sm sm:text-base"
          >
            Delete
          </button>
          <button
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
