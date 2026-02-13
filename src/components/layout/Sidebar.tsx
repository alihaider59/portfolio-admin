import { NavLink } from "react-router-dom";
import logo from "../../assets/logo1.png";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const linkClasses =
    "block px-4 py-3 rounded-md transition hover:bg-[#FF9B51] hover:text-white text-sm sm:text-base";

  return (
    <>
      {/* Mobile overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-200"
        style={{ opacity: isOpen ? 1 : 0, pointerEvents: isOpen ? "auto" : "none" }}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        className={`
          fixed top-0 left-0 bottom-0 z-50 w-64 bg-[#25343F] text-white p-4
          transform transition-transform duration-200 ease-out
          lg:relative lg:translate-x-0 lg:z-auto lg:min-h-full lg:self-stretch
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="flex items-center justify-between gap-3 mb-6 lg:mb-8">
          <div className="flex items-center gap-3 min-w-0">
            <img src={logo} alt="Logo" className="w-10 h-10 rounded-lg object-cover shrink-0" />
            <h1 className="text-lg sm:text-xl font-bold truncate">Ali Haider</h1>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/10 lg:hidden shrink-0"
            aria-label="Close menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="space-y-1">
          <NavLink
            to="/dashboard"
            onClick={onClose}
            className={({ isActive }) =>
              `${linkClasses} ${isActive ? "bg-[#FF9B51] text-white" : ""}`
            }
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/contacts"
            onClick={onClose}
            className={({ isActive }) =>
              `${linkClasses} ${isActive ? "bg-[#FF9B51] text-white" : ""}`
            }
          >
            Contacts
          </NavLink>

          <NavLink
            to="/visitors"
            onClick={onClose}
            className={({ isActive }) =>
              `${linkClasses} ${isActive ? "bg-[#FF9B51] text-white" : ""}`
            }
          >
            Visitors
          </NavLink>

          <NavLink
            to="/testimonials"
            onClick={onClose}
            className={({ isActive }) =>
              `${linkClasses} ${isActive ? "bg-[#FF9B51] text-white" : ""}`
            }
          >
            Testimonials
          </NavLink>
        </nav>
      </aside>
    </>
  );
};