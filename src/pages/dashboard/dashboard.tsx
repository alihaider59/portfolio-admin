import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getDashboard } from "../../api/dashboardApi";
import { AvatarPlaceholder } from "../../components/ui/AvatarPlaceholder";
import logo from "../../assets/logo1.png";
import {
  type DashboardData,
  type DashboardRecentContact,
  type DashboardRecentTestimonial,
  type DashboardRecentVisitor,
} from "../../types/dashboard";

const formatDate = (isoString: string): string =>
  new Date(isoString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const truncate = (str: string, maxLen: number): string =>
  str.length <= maxLen ? str : `${str.slice(0, maxLen)}...`;

export const DashboardPage = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const res = await getDashboard(5);
      setData(res.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading && !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[200px] p-6 text-[#25343F] text-sm sm:text-base md:text-lg">
        Loading dashboard...
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 sm:p-6">
        <span className="text-red-600 text-sm sm:text-base">{error}</span>
        <button
          onClick={fetchDashboard}
          className="w-full sm:w-auto px-4 py-2 bg-[#FF9B51] text-white rounded-md text-sm font-medium"
        >
          Retry
        </button>
      </div>
    );
  }

  const stats = data?.stats ?? {
    totalContacts: 0,
    totalTestimonials: 0,
    totalVisitors: 0,
    totalVisits: 0,
  };
  const recentContacts: DashboardRecentContact[] = data?.recentContacts ?? [];
  const recentTestimonials: DashboardRecentTestimonial[] =
    data?.recentTestimonials ?? [];
  const recentVisitors: DashboardRecentVisitor[] = data?.recentVisitors ?? [];

  const statCards = [
    { label: "Contacts", value: stats.totalContacts, href: "/contacts" },
    { label: "Testimonials", value: stats.totalTestimonials, href: "/testimonials" },
    { label: "Visitors", value: stats.totalVisitors, href: "/visitors" },
    { label: "Page Views", value: stats.totalVisits },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <img src={logo} alt="Logo" className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg object-cover shrink-0" />
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-semibold text-[#25343F] truncate">Dashboard</h1>
            <p className="text-sm text-[#25343F]/70">Ali Haider</p>
          </div>
        </div>
        <button
          onClick={fetchDashboard}
          disabled={loading}
          className="w-full sm:w-auto px-4 py-2 bg-[#25343F] text-white rounded-md text-sm disabled:opacity-50 shrink-0"
        >
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="bg-[#BFC9D1] p-3 sm:p-6 rounded-lg sm:rounded-xl shadow-md min-w-0"
          >
            {card.href ? (
              <Link
                to={card.href}
                className="block hover:opacity-90 transition"
              >
                <p className="text-xs sm:text-sm text-[#25343F]/80 truncate">{card.label}</p>
                <p className="text-base sm:text-2xl font-bold text-[#25343F] mt-0.5 sm:mt-1">
                  {card.value}
                </p>
              </Link>
            ) : (
              <>
                <p className="text-xs sm:text-sm text-[#25343F]/80 truncate">{card.label}</p>
                <p className="text-base sm:text-2xl font-bold text-[#25343F] mt-0.5 sm:mt-1">
                  {card.value}
                </p>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Recent sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Recent Contacts */}
        <div className="bg-[#BFC9D1] p-4 sm:p-6 rounded-xl shadow-md min-w-0 overflow-hidden">
          <div className="flex justify-between items-center gap-2 mb-4">
            <h2 className="text-base sm:text-lg font-semibold text-[#25343F] truncate">
              Recent Contacts
            </h2>
            <Link
              to="/contacts"
              className="text-sm text-[#FF9B51] hover:underline shrink-0"
            >
              View all
            </Link>
          </div>
          {recentContacts.length === 0 ? (
            <p className="text-[#25343F]/70 text-sm">No recent contacts</p>
          ) : (
            <ul className="space-y-2 sm:space-y-3">
              {recentContacts.map((c) => (
                <li
                  key={c._id}
                  className="flex flex-col gap-1 p-3 bg-[#EAEFEF] rounded-md min-w-0"
                >
                  <span className="font-medium text-[#25343F] text-sm sm:text-base truncate">
                    {c.name} — {c.email}
                  </span>
                  <span className="text-xs sm:text-sm text-[#25343F]/80 truncate block max-w-full break-words">
                    {truncate(c.message, 80)}
                  </span>
                  <span className="text-xs text-[#25343F]/60">
                    {formatDate(c.createdAt)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Recent Testimonials */}
        <div className="bg-[#BFC9D1] p-4 sm:p-6 rounded-xl shadow-md min-w-0 overflow-hidden">
          <div className="flex justify-between items-center gap-2 mb-4">
            <h2 className="text-base sm:text-lg font-semibold text-[#25343F] truncate">
              Recent Testimonials
            </h2>
            <Link
              to="/testimonials"
              className="text-sm text-[#FF9B51] hover:underline shrink-0"
            >
              View all
            </Link>
          </div>
          {recentTestimonials.length === 0 ? (
            <p className="text-[#25343F]/70 text-sm">No recent testimonials</p>
          ) : (
            <ul className="space-y-2 sm:space-y-3">
              {recentTestimonials.map((t) => (
                <li
                  key={t._id}
                  className="flex gap-2 sm:gap-3 p-3 bg-[#EAEFEF] rounded-md min-w-0"
                >
                  {t.image ? (
                    <img
                      src={t.image}
                      alt={t.name}
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover shrink-0"
                    />
                  ) : (
                    <AvatarPlaceholder name={t.name} className="w-10 h-10 sm:w-12 sm:h-12 shrink-0" />
                  )}
                  <div className="min-w-0 flex-1">
                    <span className="font-medium text-[#25343F] text-sm sm:text-base truncate block">
                      {t.name}, {t.company}
                    </span>
                    <p className="text-xs sm:text-sm text-[#25343F]/80 truncate mt-0.5">
                      {truncate(t.testimonial, 60)}
                    </p>
                    <span className="text-xs text-[#25343F]/60">
                      {formatDate(t.createdAt)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Recent Visitors */}
      <div className="bg-[#BFC9D1] p-4 sm:p-6 rounded-xl shadow-md min-w-0 overflow-hidden">
        <div className="flex justify-between items-center gap-2 mb-4">
          <h2 className="text-base sm:text-lg font-semibold text-[#25343F] truncate">
            Recent Visitors
          </h2>
          <Link
            to="/visitors"
            className="text-sm text-[#FF9B51] hover:underline shrink-0"
          >
            View all
          </Link>
        </div>
        {recentVisitors.length === 0 ? (
          <p className="text-[#25343F]/70 text-sm">No recent visitors</p>
        ) : (
          <>
            {/* Mobile: list of cards */}
            <ul className="md:hidden space-y-2">
              {recentVisitors.map((v) => (
                <li key={v._id} className="flex justify-between items-center gap-2 p-2 bg-[#EAEFEF] rounded-md text-xs sm:text-sm">
                  <span className="font-mono text-[#25343F] truncate min-w-0">{v.ipAddress}</span>
                  <span className="shrink-0 text-[#25343F]/80">{v.visits} · {formatDate(v.updatedAt)}</span>
                </li>
              ))}
            </ul>
            {/* Desktop: table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left min-w-[280px]">
                <thead>
                  <tr className="border-b border-[#25343F]/30">
                    <th className="pb-2 pr-2 text-[#25343F] text-sm font-semibold">IP Address</th>
                    <th className="pb-2 pr-2 text-[#25343F] text-sm font-semibold">Visits</th>
                    <th className="pb-2 text-[#25343F] text-sm font-semibold">Last Seen</th>
                  </tr>
                </thead>
                <tbody>
                  {recentVisitors.map((v) => (
                    <tr key={v._id} className="border-b border-[#25343F]/10">
                      <td className="py-2 pr-2 text-sm font-mono">{v.ipAddress}</td>
                      <td className="py-2 pr-2">{v.visits}</td>
                      <td className="py-2 text-sm text-[#25343F]/80 whitespace-nowrap">{formatDate(v.updatedAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
