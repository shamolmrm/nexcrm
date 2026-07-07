import { useEffect, useMemo, useState } from 'react';
import { contactsAPI } from '../services/api';
import { Search, Plus, Trash2, Edit3 } from 'lucide-react';

const statusOptions = ['all', 'lead', 'prospect', 'customer'];

export default function Contacts() {
  const [contacts, setContacts] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isModalOpen, setModalOpen] = useState(false);
  const [activeContact, setActiveContact] = useState(null);
  const [form, setForm] = useState({ name: '', company: '', email: '', phone: '', status: 'lead', value: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const data = await contactsAPI.getAll();
      setContacts(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredContacts = useMemo(() => {
    return contacts.filter((contact) => {
      const query = search.toLowerCase();
      const matchesText = [contact.name, contact.email, contact.company].some((value) =>
        value?.toLowerCase().includes(query),
      );
      const matchesStatus = statusFilter === 'all' || contact.status === statusFilter;
      return matchesText && matchesStatus;
    });
  }, [contacts, search, statusFilter]);

  const openModal = (contact = null) => {
    setActiveContact(contact);
    setForm(contact ? { ...contact } : { name: '', company: '', email: '', phone: '', status: 'lead', value: 0 });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setActiveContact(null);
  };

  const saveContact = async (event) => {
    event.preventDefault();
    try {
      if (activeContact) {
        await contactsAPI.update(activeContact._id, form);
      } else {
        await contactsAPI.create(form);
      }
      await fetchContacts();
      closeModal();
    } catch (error) {
      console.error(error);
    }
  };

  const deleteContact = async (id) => {
    if (!window.confirm('Delete this contact?')) return;
    try {
      await contactsAPI.remove(id);
      await fetchContacts();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-3xl bg-white p-6 shadow-sm shadow-slate-200 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm text-slate-500">Contacts</p>
          <h1 className="mt-2 text-2xl font-semibold text-slate-900">Manage your connections</h1>
        </div>
        <button
          onClick={() => openModal()}
          className="inline-flex items-center gap-2 rounded-2xl bg-brand-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-600"
        >
          <Plus className="h-4 w-4" />
          Add contact
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-[1fr_220px]">
        <label className="flex items-center gap-3 rounded-3xl border border-slate-200 bg-white px-4 py-3 shadow-sm shadow-slate-100">
          <Search className="h-5 w-5 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search contacts..."
            className="w-full bg-transparent text-sm text-slate-700 outline-none"
          />
        </label>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm shadow-slate-100"
        >
          {statusOptions.map((status) => (
            <option key={status} value={status}>
              {status === 'all' ? 'All statuses' : status.charAt(0).toUpperCase() + status.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm shadow-slate-200">
        <table className="min-w-full border-collapse text-left text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Company</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Phone</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Value</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="px-6 py-10 text-center text-slate-500">
                  Loading contacts...
                </td>
              </tr>
            ) : filteredContacts.length ? (
              filteredContacts.map((contact) => (
                <tr key={contact._id} className="border-t border-slate-100">
                  <td className="px-6 py-4 font-medium text-slate-900">{contact.name}</td>
                  <td className="px-6 py-4 text-slate-600">{contact.company}</td>
                  <td className="px-6 py-4 text-slate-600">{contact.email}</td>
                  <td className="px-6 py-4 text-slate-600">{contact.phone}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-600">
                      {contact.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-900">${contact.value?.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openModal(contact)} className="rounded-2xl bg-slate-100 px-3 py-2 text-slate-700 transition hover:bg-slate-200">
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button onClick={() => deleteContact(contact._id)} className="rounded-2xl bg-rose-100 px-3 py-2 text-rose-600 transition hover:bg-rose-200">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="px-6 py-10 text-center text-slate-500">
                  No contacts found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4 py-6">
          <div className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">{activeContact ? 'Edit contact' : 'Add contact'}</h2>
                <p className="text-sm text-slate-500">Use real customer details for quick CRM data.</p>
              </div>
              <button onClick={closeModal} className="rounded-2xl bg-slate-100 px-4 py-2 text-sm text-slate-700 hover:bg-slate-200">
                Close
              </button>
            </div>
            <form onSubmit={saveContact} className="mt-6 grid gap-4 md:grid-cols-2">
              {['name', 'company', 'email', 'phone', 'value'].map((field) => (
                <label key={field} className="space-y-2 text-sm text-slate-700">
                  <span className="capitalize">{field}</span>
                  <input
                    value={form[field] || ''}
                    type={field === 'email' ? 'email' : field === 'value' ? 'number' : 'text'}
                    onChange={(e) => setForm((prev) => ({ ...prev, [field]: field === 'value' ? Number(e.target.value) : e.target.value }))}
                    className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                    required={field === 'name' || field === 'email'}
                  />
                </label>
              ))}
              <label className="space-y-2 text-sm text-slate-700">
                <span>Status</span>
                <select
                  value={form.status}
                  onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value }))}
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                >
                  {statusOptions.filter((status) => status !== 'all').map((status) => (
                    <option key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </select>
              </label>
              <button type="submit" className="md:col-span-2 inline-flex justify-center rounded-3xl bg-brand-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-600">
                Save contact
              </button>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}
