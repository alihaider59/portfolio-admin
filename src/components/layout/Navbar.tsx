import { useAuth } from "../../context/AuthContext";

interface NavbarProps {
  onMenuClick: () => void;
}

export const Navbar = ({ onMenuClick }: NavbarProps) => {
  const { logout } = useAuth();

  return (
    <header className="bg-[#BFC9D1] px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center gap-3 shadow-sm shrink-0">
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={onMenuClick}
          className="p-2 rounded-lg hover:bg-[#25343F]/10 text-[#25343F] lg:hidden shrink-0"
          aria-label="Open menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <p className="text-[#25343F] font-semibold text-sm sm:text-base truncate">
          Welcome, <span className="font-bold">Ali Haider</span>
        </p>
      </div>

      <button
        onClick={logout}
        className="bg-[#FF9B51] text-white px-3 py-2 sm:px-4 rounded-md hover:opacity-90 transition font-medium text-sm sm:text-base shrink-0"
      >
        Logout
      </button>
    </header>
  );
};