import { NavLink } from "react-router-dom";
import logo from "../../assets/logo1.png";

export const Sidebar = () => {
  const linkClasses =
    "block px-4 py-2 rounded-md transition hover:bg-[#FF9B51] hover:text-white";

  return (
    <aside className="w-64 min-h-screen bg-[#25343F] text-white p-4">
      <div className="flex items-center gap-3 mb-8">
        <img src={logo} alt="Logo" className="w-10 h-10 rounded-lg object-cover" />
        <h1 className="text-xl font-bold">Ali Haider</h1>
      </div>

      <nav className="space-y-2">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `${linkClasses} ${isActive ? "bg-[#FF9B51] text-white" : ""}`
          }
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/contacts"
          className={({ isActive }) =>
            `${linkClasses} ${isActive ? "bg-[#FF9B51] text-white" : ""}`
          }
        >
          Contacts
        </NavLink>

        <NavLink
          to="/visitors"
          className={({ isActive }) =>
            `${linkClasses} ${isActive ? "bg-[#FF9B51] text-white" : ""}`
          }
        >
          Visitors
        </NavLink>

        <NavLink
          to="/testimonials"
          className={({ isActive }) =>
            `${linkClasses} ${isActive ? "bg-[#FF9B51] text-white" : ""}`
          }
        >
          Testimonials
        </NavLink>
      </nav>
    </aside>
  );
};