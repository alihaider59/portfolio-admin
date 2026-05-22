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

const panelClass =
  "bg-white rounded-xl shadow-md border border-[#433D8B]/30 overflow-hidden min-w-0";

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
      <div className="flex flex-col items-center justify-center min-h-[200px] p-6 text-[#17153B] text-sm sm:text-base md:text-lg">
        Loading dashboard...
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 sm:p-6">
        <span className="text-red-600 text-sm sm:text-base">{error}</span>
        <button
          type="button"
          onClick={fetchDashboard}
          className="w-full sm:w-auto px-4 py-2 bg-[#17153B] text-white rounded-xl text-sm font-medium hover:bg-[#2E236C] transition"
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

  const viewAllClass =
    "text-sm font-medium text-[#433D8B] hover:text-[#17153B] hover:underline shrink-0 transition";

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <img
            src={logo}
            alt="Logo"
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl object-cover shrink-0 border border-[#433D8B]/20"
          />
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-semibold text-[#17153B] truncate">
              Dashboard
            </h1>
            <p className="text-sm text-[#17153B]/70">Ali Haider</p>
          </div>
        </div>
        <button
          type="button"
          onClick={fetchDashboard}
          disabled={loading}
          className="w-full sm:w-auto px-4 py-2 bg-[#17153B] text-white rounded-xl text-sm font-medium hover:bg-[#2E236C] disabled:opacity-50 shrink-0 transition"
        >
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
        {statCards.map((card) => {
          const content = (
            <>
              <p className="text-xs sm:text-sm text-white/80 truncate">{card.label}</p>
              <p className="text-base sm:text-2xl font-bold text-white mt-0.5 sm:mt-1">
                {card.value}
              </p>
            </>
          );

          return (
            <div
              key={card.label}
              className="bg-[#17153B] p-3 sm:p-6 rounded-xl shadow-md min-w-0 hover:bg-[#2E236C] transition"
            >
              {card.href ? (
                <Link to={card.href} className="block">
                  {content}
                </Link>
              ) : (
                content
              )}
            </div>
          );
        })}
      </div>

      {/* Recent sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className={panelClass}>
          <div className="flex justify-between items-center gap-2 p-4 sm:p-6 pb-0 sm:pb-0 border-b border-[#433D8B]/20">
            <h2 className="text-base sm:text-lg font-semibold text-[#17153B] truncate">
              Recent Contacts
            </h2>
            <Link to="/contacts" className={viewAllClass}>
              View all
            </Link>
          </div>
          <div className="p-4 sm:p-6 pt-4">
            {recentContacts.length === 0 ? (
              <p className="text-[#17153B]/70 text-sm">No recent contacts</p>
            ) : (
              <ul className="space-y-2 sm:space-y-3">
                {recentContacts.map((c) => (
                  <li
                    key={c._id}
                    className="flex flex-col gap-1 p-3 bg-[#F0EBF5] rounded-xl border border-[#433D8B]/15 min-w-0"
                  >
                    <span className="font-medium text-[#17153B] text-sm sm:text-base truncate">
                      {c.name} — {c.email}
                    </span>
                    <span className="text-xs sm:text-sm text-[#17153B]/80 truncate block max-w-full break-words">
                      {truncate(c.message, 80)}
                    </span>
                    <span className="text-xs text-[#17153B]/60">
                      {formatDate(c.createdAt)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className={panelClass}>
          <div className="flex justify-between items-center gap-2 p-4 sm:p-6 pb-0 sm:pb-0 border-b border-[#433D8B]/20">
            <h2 className="text-base sm:text-lg font-semibold text-[#17153B] truncate">
              Recent Testimonials
            </h2>
            <Link to="/testimonials" className={viewAllClass}>
              View all
            </Link>
          </div>
          <div className="p-4 sm:p-6 pt-4">
            {recentTestimonials.length === 0 ? (
              <p className="text-[#17153B]/70 text-sm">No recent testimonials</p>
            ) : (
              <ul className="space-y-2 sm:space-y-3">
                {recentTestimonials.map((t) => (
                  <li
                    key={t._id}
                    className="flex gap-2 sm:gap-3 p-3 bg-[#F0EBF5] rounded-xl border border-[#433D8B]/15 min-w-0"
                  >
                    {t.image ? (
                      <img
                        src={t.image}
                        alt={t.name}
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover shrink-0 border-2 border-[#433D8B]/25"
                      />
                    ) : (
                      <AvatarPlaceholder
                        name={t.name}
                        className="w-10 h-10 sm:w-12 sm:h-12 shrink-0"
                      />
                    )}
                    <div className="min-w-0 flex-1">
                      <span className="font-medium text-[#17153B] text-sm sm:text-base truncate block">
                        {t.name}, {t.company}
                      </span>
                      <p className="text-xs sm:text-sm text-[#17153B]/80 truncate mt-0.5">
                        {truncate(t.testimonial, 60)}
                      </p>
                      <span className="text-xs text-[#17153B]/60">
                        {formatDate(t.createdAt)}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      <div className={panelClass}>
        <div className="flex justify-between items-center gap-2 p-4 sm:p-6 pb-0 sm:pb-0 border-b border-[#433D8B]/20">
          <h2 className="text-base sm:text-lg font-semibold text-[#17153B] truncate">
            Recent Visitors
          </h2>
          <Link to="/visitors" className={viewAllClass}>
            View all
          </Link>
        </div>
        <div className="p-4 sm:p-6 pt-4">
          {recentVisitors.length === 0 ? (
            <p className="text-[#17153B]/70 text-sm">No recent visitors</p>
          ) : (
            <>
              <ul className="md:hidden space-y-2">
                {recentVisitors.map((v) => (
                  <li
                    key={v._id}
                    className="flex justify-between items-center gap-2 p-3 bg-[#F0EBF5] rounded-xl border border-[#433D8B]/15 text-xs sm:text-sm"
                  >
                    <span className="font-mono text-[#17153B] truncate min-w-0">
                      {v.ipAddress}
                    </span>
                    <span className="shrink-0 text-[#17153B]/80">
                      {v.visits} · {formatDate(v.updatedAt)}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left min-w-[280px]">
                  <thead>
                    <tr className="border-b border-[#433D8B]/25 bg-[#F0EBF5]">
                      <th className="px-3 py-2 text-[#17153B] text-sm font-semibold rounded-tl-lg">
                        IP Address
                      </th>
                      <th className="px-3 py-2 text-[#17153B] text-sm font-semibold">
                        Visits
                      </th>
                      <th className="px-3 py-2 text-[#17153B] text-sm font-semibold rounded-tr-lg">
                        Last Seen
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentVisitors.map((v) => (
                      <tr
                        key={v._id}
                        className="border-b border-[#433D8B]/15 hover:bg-[#F0EBF5]/80"
                      >
                        <td className="px-3 py-2 text-sm font-mono text-[#17153B]">
                          {v.ipAddress}
                        </td>
                        <td className="px-3 py-2 text-[#17153B]">{v.visits}</td>
                        <td className="px-3 py-2 text-sm text-[#17153B]/80 whitespace-nowrap">
                          {formatDate(v.updatedAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
