import { useAuth } from "../../context/AuthContext";

export const Navbar = () => {
  const { logout } = useAuth();

  return (
    <header className="bg-[#BFC9D1] px-6 py-4 flex justify-between items-center shadow-sm">
      <div className="text-[#25343F] font-semibold">
        Welcome, <span className="text-[#25343F] font-bold">Ali Haider</span>
      </div>

      <button
        onClick={logout}
        className="bg-[#FF9B51] text-white px-4 py-2 rounded-md hover:opacity-90 transition font-medium"
      >
        Logout
      </button>
    </header>
  );
};