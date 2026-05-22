import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { ResponseModal } from "../../components/ui/ResponseModal";

export const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorModal, setErrorModal] = useState<{ title: string; message: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login({ email, password });
      navigate("/dashboard");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Login failed.";
      setErrorModal({ title: "Login Failed", message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F0EBF5] flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md bg-white border border-[#433D8B]/40 p-6 sm:p-8 rounded-xl shadow-md">
        <h2 className="text-xl sm:text-2xl font-bold text-[#17153B] mb-6 text-center">
          Admin Login
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#17153B] mb-1">
              Email
            </label>
            <input
              type="email"
              required
              className="w-full px-3 py-2 rounded-md border border-[#433D8B]/50 focus:outline-none focus:ring-2 focus:ring-[#C8ACD6]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#17153B] mb-1">
              Password
            </label>
            <input
              type="password"
              required
              className="w-full px-3 py-2 rounded-md border border-[#433D8B]/50 focus:outline-none focus:ring-2 focus:ring-[#C8ACD6]"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#17153B] text-white py-2 rounded-md font-semibold hover:bg-[#2E236C] transition disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>

      {errorModal && (
        <ResponseModal
          type="error"
          title={errorModal.title}
          message={errorModal.message}
          onClose={() => setErrorModal(null)}
        />
      )}
    </div>
  );
};
