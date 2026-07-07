import { useEffect, useMemo, useState } from 'react';
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { reportsAPI } from '../services/api';
import { Download } from 'lucide-react';

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function Reports() {
  const [summary, setSummary] = useState(null);
  const [monthly, setMonthly] = useState([]);
  const [pipeline, setPipeline] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [summaryData, monthlyData, pipelineData] = await Promise.all([
          reportsAPI.summary(),
          reportsAPI.monthly(),
          reportsAPI.pipeline(),
        ]);
        setSummary(summaryData);
        setMonthly(monthlyData);
        setPipeline(pipelineData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const chartData = useMemo(
    () => monthly.map((item) => ({ name: monthNames[item.month - 1] || 'Month', revenue: item.revenue })),
    [monthly],
  );

  const downloadCSV = () => {
    const rows = [['Stage', 'Count', 'Total value'], ...pipeline.map((item) => [item.stage, item.count, item.totalValue])];
    const csv = rows.map((row) => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const href = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = href;
    anchor.download = 'pipeline-report.csv';
    anchor.click();
    URL.revokeObjectURL(href);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white p-6 shadow-sm shadow-slate-200">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm text-slate-500">Reports</p>
            <h1 className="mt-2 text-2xl font-semibold text-slate-900">Business performance</h1>
          </div>
          <button onClick={downloadCSV} className="inline-flex items-center gap-2 rounded-2xl bg-brand-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-600">
            <Download className="h-4 w-4" />
            Export CSV
          </button>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        {['Revenue', 'Contacts', 'Deals', 'Win rate'].map((label) => {
          const content =
            !summary
              ? '–'
              : label === 'Revenue'
              ? `$${summary.revenue.toLocaleString()}`
              : label === 'Contacts'
              ? summary.contacts
              : label === 'Deals'
              ? summary.deals
              : `${summary.winRate}%`;
          return (
            <div key={label} className="rounded-3xl bg-white p-6 shadow-sm shadow-slate-200">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-500">{label}</p>
              <p className="mt-4 text-3xl font-semibold text-slate-900">{loading ? 'Loading...' : content}</p>
            </div>
          );
        })}
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.7fr_0.3fr]">
        <section className="rounded-3xl bg-white p-6 shadow-sm shadow-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Monthly revenue</p>
              <h2 className="mt-2 text-xl font-semibold text-slate-900">Last 6 months</h2>
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
          <div>
            <p className="text-sm text-slate-500">Pipeline distribution</p>
            <h2 className="mt-2 text-xl font-semibold text-slate-900">Deal stages</h2>
          </div>
          <div className="mt-6 h-80">
            {loading ? (
              <div className="h-full animate-pulse rounded-3xl bg-slate-100" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pipeline} dataKey="count" nameKey="stage" cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={4}>
                    {pipeline.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={['#185FA5', '#2563eb', '#f59e0b', '#ea580c', '#16a34a'][index % 5]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name) => [`${value}`, name]} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
