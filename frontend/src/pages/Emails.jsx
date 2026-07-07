import { useEffect, useState } from 'react';
import { emailsAPI } from '../services/api';

export default function Emails() {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEmails();
  }, []);

  const fetchEmails = async () => {
    setLoading(true);
    try {
      const data = await emailsAPI.getAll();
      setEmails(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const markRead = async (email) => {
    if (email.read) return;
    try {
      await emailsAPI.markRead(email._id);
      fetchEmails();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white p-6 shadow-sm shadow-slate-200">
        <p className="text-sm text-slate-500">Emails</p>
        <h1 className="mt-2 text-2xl font-semibold text-slate-900">Inbox</h1>
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm shadow-slate-200">
        <table className="min-w-full border-collapse text-left text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-6 py-4">From</th>
              <th className="px-6 py-4">Subject</th>
              <th className="px-6 py-4">Related</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" className="px-6 py-10 text-center text-slate-500">Loading emails...</td></tr>
            ) : emails.length ? (
              emails.map((email) => (
                <tr key={email._id} className={`border-t border-slate-100 ${email.read ? '' : 'bg-slate-50'}`}>
                  <td className="px-6 py-4 text-slate-900">{email.from}</td>
                  <td className="px-6 py-4">
                    <button onClick={() => markRead(email)} className={`text-left text-sm ${email.read ? 'text-slate-700' : 'text-slate-900 font-semibold'}`}>
                      {email.subject}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{email.relatedTo || '-'}</td>
                  <td className="px-6 py-4 text-slate-600">{new Date(email.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase ${email.read ? 'bg-slate-100 text-slate-600' : 'bg-brand-500 text-white'}`}>
                      {email.read ? 'Read' : 'Unread'}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="5" className="px-6 py-10 text-center text-slate-500">No emails available.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
