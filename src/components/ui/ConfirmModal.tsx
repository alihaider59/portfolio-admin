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
      : "bg-[#17153B] hover:bg-[#17153B]/90";

  return (
    <div
      className="fixed inset-0 bg-black/50 flex justify-center items-center z-[60] p-3 sm:p-4 overflow-y-auto"
      onClick={(e) => e.target === e.currentTarget && onCancel()}
    >
      <div
        className="bg-white rounded-xl shadow-xl max-w-md w-full p-4 sm:p-6 my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-base sm:text-lg font-semibold text-[#17153B] mb-2">{title}</h3>
        <p className="text-[#17153B]/80 text-sm mb-6 break-words">{message}</p>
        <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3">
          <button
            onClick={onCancel}
            className="w-full sm:w-auto px-4 py-2 rounded-lg bg-[#433D8B] text-[#17153B] hover:bg-[#433D8B]/80 font-medium transition text-sm sm:text-base"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            disabled={confirmDisabled}
            className={`w-full sm:w-auto px-4 py-2 rounded-lg text-white font-medium transition disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base ${confirmBg}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
