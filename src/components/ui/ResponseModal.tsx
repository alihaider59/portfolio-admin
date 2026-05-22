interface Props {
  type: "success" | "error";
  title: string;
  message: string;
  onClose: () => void;
}

export const ResponseModal = ({ type, title, message, onClose }: Props) => {
  const isSuccess = type === "success";
  const iconBg = isSuccess ? "bg-green-100" : "bg-red-100";
  const iconColor = isSuccess ? "text-green-600" : "text-red-600";
  const buttonBg = isSuccess ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700";

  return (
    <div
      className="fixed inset-0 bg-black/50 flex justify-center items-center z-[60] p-3 sm:p-4 overflow-y-auto"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="bg-white rounded-xl shadow-xl max-w-md w-full p-4 sm:p-6 my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`w-12 h-12 rounded-full ${iconBg} flex items-center justify-center mx-auto mb-4`}>
          {isSuccess ? (
            <svg className={`w-6 h-6 ${iconColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className={`w-6 h-6 ${iconColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
        </div>
        <h3 className="text-base sm:text-lg font-semibold text-[#17153B] text-center mb-2">{title}</h3>
        <p className="text-[#17153B]/80 text-center text-sm mb-6 break-words">{message}</p>
        <div className="flex justify-center">
          <button
            onClick={onClose}
            className={`px-6 py-2 rounded-lg text-white font-medium transition text-sm sm:text-base ${buttonBg}`}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};
