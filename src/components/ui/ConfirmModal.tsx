interface Props {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "default";
  confirmDisabled?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal = ({
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "danger",
  confirmDisabled = false,
  onConfirm,
  onCancel,
}: Props) => {
  const confirmBg =
    variant === "danger"
      ? "bg-red-600 hover:bg-red-700"
      : "bg-[#25343F] hover:bg-[#25343F]/90";

  return (
    <div
      className="fixed inset-0 bg-black/50 flex justify-center items-center z-[60] p-4"
      onClick={(e) => e.target === e.currentTarget && onCancel()}
    >
      <div
        className="bg-white rounded-xl shadow-xl max-w-md w-full p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-semibold text-[#25343F] mb-2">{title}</h3>
        <p className="text-[#25343F]/80 text-sm mb-6">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg bg-[#BFC9D1] text-[#25343F] hover:bg-[#BFC9D1]/80 font-medium transition"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            disabled={confirmDisabled}
            className={`px-4 py-2 rounded-lg text-white font-medium transition disabled:opacity-50 disabled:cursor-not-allowed ${confirmBg}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
