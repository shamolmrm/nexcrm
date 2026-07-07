import { useState } from 'react';
import { Trash2 } from 'lucide-react';

const integrations = [
  { label: 'MongoDB', status: 'connected' },
  { label: 'REST API', status: 'active' },
  { label: 'Email SMTP', status: 'inactive' },
];

const team = [
  { name: 'Amina Rahman', role: 'Sales lead', email: 'amina@example.com' },
  { name: 'Sami Ahmed', role: 'Support agent', email: 'sami@example.com' },
];

export default function Settings() {
  const [form, setForm] = useState({ company: 'NexCRM', currency: 'USD', timezone: 'GMT+6' });

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white p-6 shadow-sm shadow-slate-200">
        <p className="text-sm text-slate-500">Settings</p>
        <h1 className="mt-2 text-2xl font-semibold text-slate-900">Company preferences</h1>
      </div>

      <section className="rounded-3xl bg-white p-6 shadow-sm shadow-slate-200">
        <h2 className="text-lg font-semibold text-slate-900">Organization</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {['company', 'currency', 'timezone'].map((field) => (
            <label key={field} className="space-y-2 text-sm text-slate-700">
              <span className="capitalize">{field.replace('timezone', 'Timezone')}</span>
              <input value={form[field]} onChange={(e) => setForm((prev) => ({ ...prev, [field]: e.target.value }))} className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100" />
            </label>
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.7fr_0.3fr]">
        <div className="rounded-3xl bg-white p-6 shadow-sm shadow-slate-200">
          <h2 className="text-lg font-semibold text-slate-900">Integration status</h2>
          <div className="mt-6 space-y-4">
            {integrations.map((integration) => (
              <div key={integration.label} className="flex items-center justify-between rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4">
                <div>
                  <p className="font-medium text-slate-900">{integration.label}</p>
                  <p className="text-sm text-slate-500">{integration.status === 'connected' ? 'Connected successfully' : integration.status === 'active' ? 'API active' : 'Not configured'}</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase ${integration.status === 'connected' || integration.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                  {integration.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm shadow-slate-200">
          <h2 className="text-lg font-semibold text-slate-900">Team members</h2>
          <div className="mt-6 space-y-4">
            {team.map((member) => (
              <div key={member.email} className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-medium text-slate-900">{member.name}</p>
                    <p className="text-sm text-slate-500">{member.role}</p>
                    <p className="text-sm text-slate-500">{member.email}</p>
                  </div>
                  <button className="rounded-2xl bg-rose-100 p-3 text-rose-600 hover:bg-rose-200">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-3xl bg-white p-6 shadow-sm shadow-slate-200">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-rose-500">Danger zone</p>
            <h2 className="mt-2 text-xl font-semibold text-slate-900">Delete account</h2>
            <p className="mt-1 text-sm text-slate-500">This action cannot be undone. Only do this if you want to remove your account permanently.</p>
          </div>
          <button onClick={() => window.confirm('Delete account? This cannot be undone.')} className="rounded-3xl bg-rose-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-rose-600">Delete account</button>
        </div>
      </section>
    </div>
  );
}
