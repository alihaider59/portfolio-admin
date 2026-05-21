import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/** Unknown routes: keep logged-in users in the app instead of showing the login page. */
export const CatchAllRedirect = () => {
  const { token, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-[#25343F]">
        Loading...
      </div>
    );
  }

  return <Navigate to={token ? "/dashboard" : "/login"} replace />;
};
