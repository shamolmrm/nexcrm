import { useEffect, useMemo, useState } from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { dealsAPI, reportsAPI } from '../services/api';

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [monthly, setMonthly] = useState([]);
  const [recentDeals, setRecentDeals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [summaryData, monthlyData, dealsData] = await Promise.all([
          reportsAPI.summary(),
          reportsAPI.monthly(),
          dealsAPI.getAll(),
        ]);
        setSummary(summaryData);
        setMonthly(monthlyData);
        setRecentDeals(dealsData.slice(0, 5));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const chartData = useMemo(
    () =>
      monthly.map((item) => ({
        name: monthNames[item.month - 1] || 'Month',
        revenue: item.revenue,
      })),
    [monthly],
  );

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {['Revenue', 'Contacts', 'Deals', 'Win Rate'].map((label, idx) => {
          const value =
            !summary
              ? '—'
              : label === 'Revenue'
              ? `$${summary.revenue.toLocaleString()}`
              : label === 'Contacts'
              ? summary.contacts
              : label === 'Deals'
              ? summary.deals
              : `${summary.winRate}%`;
          return (
            <div key={label} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500">{label}</p>
              <p className="mt-4 text-3xl font-semibold text-slate-900">{loading ? 'Loading...' : value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <section className="rounded-3xl bg-white p-6 shadow-sm shadow-slate-200">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm text-slate-500">Monthly revenue</p>
              <h2 className="mt-2 text-xl font-semibold text-slate-900">Revenue trend</h2>
            </div>
          </div>
          <div className="mt-6 h-80">
            {loading ? (
              <div className="h-full animate-pulse rounded-3xl bg-slate-100" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                  <Bar dataKey="revenue" fill="#185FA5" radius={[10, 10, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </section>

        <section className="rounded-3xl bg-white p-6 shadow-sm shadow-slate-200">
          <p className="text-sm text-slate-500">Recent deals</p>
          <h2 className="mt-2 text-xl font-semibold text-slate-900">Latest activity</h2>
          <div className="mt-6 space-y-4">
            {loading ? (
              Array.from({ length: 3 }).map((_, idx) => (
                <div key={idx} className="h-20 rounded-3xl bg-slate-100" />
              ))
            ) : recentDeals.length ? (
              recentDeals.map((deal) => (
                <div key={deal._id} className="rounded-3xl border border-slate-200 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold text-slate-900">{deal.name}</p>
                      <p className="text-sm text-slate-500">{deal.contact?.name || 'Unknown contact'}</p>
                    </div>
                    <p className="text-sm font-semibold text-brand-600">${deal.value.toLocaleString()}</p>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-sm text-slate-500">
                    <span>{new Date(deal.closeDate).toLocaleDateString()}</span>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs uppercase tracking-[0.15em] text-slate-600">{deal.stage}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500">No recent deals yet.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
