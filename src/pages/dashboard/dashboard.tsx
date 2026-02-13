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
      <div className="text-[#25343F] text-lg">Loading dashboard...</div>
    );
  }

  if (error && !data) {
    return (
      <div className="text-red-600">
        {error}
        <button
          onClick={fetchDashboard}
          className="ml-3 px-4 py-2 bg-[#FF9B51] text-white rounded-md"
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <img src={logo} alt="Logo" className="w-12 h-12 rounded-lg object-cover" />
          <div>
            <h1 className="text-2xl font-semibold text-[#25343F]">Dashboard</h1>
            <p className="text-sm text-[#25343F]/70">Ali Haider</p>
          </div>
        </div>
        <button
          onClick={fetchDashboard}
          disabled={loading}
          className="px-4 py-2 bg-[#25343F] text-white rounded-md text-sm disabled:opacity-50"
        >
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="bg-[#BFC9D1] p-6 rounded-xl shadow-md"
          >
            {card.href ? (
              <Link
                to={card.href}
                className="block hover:opacity-90 transition"
              >
                <p className="text-sm text-[#25343F]/80">{card.label}</p>
                <p className="text-2xl font-bold text-[#25343F] mt-1">
                  {card.value}
                </p>
              </Link>
            ) : (
              <>
                <p className="text-sm text-[#25343F]/80">{card.label}</p>
                <p className="text-2xl font-bold text-[#25343F] mt-1">
                  {card.value}
                </p>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Recent sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Contacts */}
        <div className="bg-[#BFC9D1] p-6 rounded-xl shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-[#25343F]">
              Recent Contacts
            </h2>
            <Link
              to="/contacts"
              className="text-sm text-[#FF9B51] hover:underline"
            >
              View all
            </Link>
          </div>
          {recentContacts.length === 0 ? (
            <p className="text-[#25343F]/70 text-sm">No recent contacts</p>
          ) : (
            <ul className="space-y-3">
              {recentContacts.map((c) => (
                <li
                  key={c._id}
                  className="flex flex-col gap-1 p-3 bg-[#EAEFEF] rounded-md"
                >
                  <span className="font-medium text-[#25343F]">
                    {c.name} — {c.email}
                  </span>
                  <span className="text-sm text-[#25343F]/80 truncate">
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
        <div className="bg-[#BFC9D1] p-6 rounded-xl shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-[#25343F]">
              Recent Testimonials
            </h2>
            <Link
              to="/testimonials"
              className="text-sm text-[#FF9B51] hover:underline"
            >
              View all
            </Link>
          </div>
          {recentTestimonials.length === 0 ? (
            <p className="text-[#25343F]/70 text-sm">No recent testimonials</p>
          ) : (
            <ul className="space-y-3">
              {recentTestimonials.map((t) => (
                <li
                  key={t._id}
                  className="flex gap-3 p-3 bg-[#EAEFEF] rounded-md"
                >
                  {t.image ? (
                    <img
                      src={t.image}
                      alt={t.name}
                      className="w-12 h-12 rounded-full object-cover shrink-0"
                    />
                  ) : (
                    <AvatarPlaceholder name={t.name} className="w-12 h-12 shrink-0" />
                  )}
                  <div className="min-w-0 flex-1">
                    <span className="font-medium text-[#25343F]">
                      {t.name}, {t.company}
                    </span>
                    <p className="text-sm text-[#25343F]/80 truncate mt-0.5">
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
      <div className="bg-[#BFC9D1] p-6 rounded-xl shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-[#25343F]">
            Recent Visitors
          </h2>
          <Link
            to="/visitors"
            className="text-sm text-[#FF9B51] hover:underline"
          >
            View all
          </Link>
        </div>
        {recentVisitors.length === 0 ? (
          <p className="text-[#25343F]/70 text-sm">No recent visitors</p>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[#25343F]/30">
                <th className="pb-2 text-[#25343F]">IP Address</th>
                <th className="pb-2 text-[#25343F]">Visits</th>
                <th className="pb-2 text-[#25343F]">Last Seen</th>
              </tr>
            </thead>
            <tbody>
              {recentVisitors.map((v) => (
                <tr key={v._id} className="border-b border-[#25343F]/10">
                  <td className="py-2">{v.ipAddress}</td>
                  <td className="py-2">{v.visits}</td>
                  <td className="py-2 text-sm text-[#25343F]/80">
                    {formatDate(v.updatedAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
