import type { ReactNode } from "react";

interface Props {
  title: string;
  onClose: () => void;
  children: ReactNode;
}

export const DetailModal = ({ title, onClose, children }: Props) => (
  <div
    className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-3 sm:p-4 overflow-y-auto"
    onClick={(e) => e.target === e.currentTarget && onClose()}
  >
    <div className="bg-[#F0EBF5] p-4 sm:p-6 rounded-xl w-full max-w-lg shadow-xl max-h-[90vh] overflow-y-auto my-auto">
      <div className="flex justify-between items-center gap-2 mb-4">
        <h2 className="text-base sm:text-lg font-semibold text-[#17153B] truncate">{title}</h2>
        <button
          onClick={onClose}
          className="p-2 rounded-lg hover:bg-[#433D8B] text-[#17153B] transition shrink-0"
          aria-label="Close"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      {children}
    </div>
  </div>
);
