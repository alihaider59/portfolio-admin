import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { token, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!token) return <Navigate to="/login" replace />;

  return children;
};