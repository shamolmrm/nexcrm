import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '', phone: user?.phone || '' });
  const [passwordForm, setPasswordForm] = useState({ current: '', password: '', confirm: '' });
  const [preferences, setPreferences] = useState({ emailUpdates: true, productAlerts: false });

  const saveProfile = (event) => {
    event.preventDefault();
    updateUser(form);
    toast.success('Profile saved successfully');
  };

  const handlePassword = (event) => {
    event.preventDefault();
    if (passwordForm.password !== passwordForm.confirm) {
      toast.error('Passwords do not match');
      return;
    }
    setPasswordForm({ current: '', password: '', confirm: '' });
    toast.success('Password updated successfully');
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white p-6 shadow-sm shadow-slate-200">
        <p className="text-sm text-slate-500">Profile</p>
        <h1 className="mt-2 text-2xl font-semibold text-slate-900">Your account settings</h1>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.75fr_0.55fr]">
        <section className="rounded-3xl bg-white p-6 shadow-sm shadow-slate-200">
          <h2 className="text-lg font-semibold text-slate-900">Personal details</h2>
          <form onSubmit={saveProfile} className="mt-6 space-y-4">
            {['name', 'email', 'phone'].map((field) => (
              <label key={field} className="block text-sm text-slate-700">
                <span className="mb-2 block capitalize">{field.replace('phone', 'Phone')}</span>
                <input
                  type={field === 'email' ? 'email' : 'text'}
                  value={form[field]}
                  onChange={(e) => setForm((prev) => ({ ...prev, [field]: e.target.value }))}
                  className="mt-1 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                  required
                />
              </label>
            ))}
            <button type="submit" className="inline-flex rounded-3xl bg-brand-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-600">Save changes</button>
          </form>
        </section>

        <section className="rounded-3xl bg-white p-6 shadow-sm shadow-slate-200">
          <h2 className="text-lg font-semibold text-slate-900">Notification preferences</h2>
          {['emailUpdates', 'productAlerts'].map((key) => (
            <label key={key} className="mt-4 flex items-center justify-between rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4">
              <div>
                <p className="font-medium text-slate-900">{key === 'emailUpdates' ? 'Email updates' : 'Product alerts'}</p>
                <p className="text-sm text-slate-500">Receive notifications for {key === 'emailUpdates' ? 'account activity' : 'product news'}.</p>
              </div>
              <input type="checkbox" checked={preferences[key]} onChange={(e) => setPreferences((prev) => ({ ...prev, [key]: e.target.checked }))} className="h-5 w-5 rounded-md text-brand-600" />
            </label>
          ))}
        </section>
      </div>

      <section className="rounded-3xl bg-white p-6 shadow-sm shadow-slate-200">
        <h2 className="text-lg font-semibold text-slate-900">Change password</h2>
        <form onSubmit={handlePassword} className="mt-6 grid gap-4 md:grid-cols-2">
          <label className="block text-sm text-slate-700">
            <span>Current password</span>
            <input type="password" value={passwordForm.current} onChange={(e) => setPasswordForm((prev) => ({ ...prev, current: e.target.value }))} className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100" required />
          </label>
          <label className="block text-sm text-slate-700">
            <span>New password</span>
            <input type="password" value={passwordForm.password} onChange={(e) => setPasswordForm((prev) => ({ ...prev, password: e.target.value }))} className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100" required />
          </label>
          <label className="block text-sm text-slate-700 md:col-span-2">
            <span>Confirm password</span>
            <input type="password" value={passwordForm.confirm} onChange={(e) => setPasswordForm((prev) => ({ ...prev, confirm: e.target.value }))} className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100" required />
          </label>
          <button type="submit" className="md:col-span-2 inline-flex justify-center rounded-3xl bg-brand-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-600">Update password</button>
        </form>
      </section>
    </div>
  );
}
