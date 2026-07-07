import { useEffect, useMemo, useState } from 'react';
import { dealsAPI, contactsAPI } from '../services/api';
import { Plus, Edit3, Trash2 } from 'lucide-react';

const stageOptions = ['Lead', 'Qualified', 'Proposal', 'Negotiation', 'Won'];

function currency(value) {
  return `$${Number(value || 0).toLocaleString()}`;
}

export default function Deals() {
  const [deals, setDeals] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [stageFilter, setStageFilter] = useState('all');
  const [isModalOpen, setModalOpen] = useState(false);
  const [activeDeal, setActiveDeal] = useState(null);
  const [form, setForm] = useState({ name: '', contact: '', stage: 'Lead', value: 0, closeDate: new Date().toISOString().slice(0, 10) });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [dealData, contactData] = await Promise.all([dealsAPI.getAll(), contactsAPI.getAll()]);
      setDeals(dealData);
      setContacts(contactData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredDeals = useMemo(() => {
    return deals.filter((deal) => stageFilter === 'all' || deal.stage === stageFilter);
  }, [deals, stageFilter]);

  const openModal = (deal = null) => {
    setActiveDeal(deal);
    setForm(
      deal
        ? {
            name: deal.name,
            contact: deal.contact?._id || deal.contact,
            stage: deal.stage,
            value: deal.value,
            closeDate: deal.closeDate ? deal.closeDate.slice(0, 10) : new Date().toISOString().slice(0, 10),
          }
        : { name: '', contact: contacts[0]?._id || '', stage: 'Lead', value: 0, closeDate: new Date().toISOString().slice(0, 10) },
    );
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setActiveDeal(null);
  };

  const saveDeal = async (event) => {
    event.preventDefault();
    try {
      if (activeDeal) {
        await dealsAPI.update(activeDeal._id, form);
      } else {
        await dealsAPI.create(form);
      }
      await fetchData();
      closeModal();
    } catch (error) {
      console.error(error);
    }
  };

  const deleteDeal = async (id) => {
    if (!window.confirm('Delete this deal?')) return;
    try {
      await dealsAPI.remove(id);
      await fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-3xl bg-white p-6 shadow-sm shadow-slate-200 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm text-slate-500">Deals</p>
          <h1 className="mt-2 text-2xl font-semibold text-slate-900">Close more opportunities</h1>
        </div>
        <button onClick={() => openModal()} className="inline-flex items-center gap-2 rounded-2xl bg-brand-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-600">
          <Plus className="h-4 w-4" />
          Add deal
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-[1fr_220px]">
        <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-100">
          <p className="text-sm text-slate-500">Showing {filteredDeals.length} deals</p>
        </div>
        <select value={stageFilter} onChange={(e) => setStageFilter(e.target.value)} className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm shadow-slate-100">
          <option value="all">All stages</option>
          {stageOptions.map((stage) => (
            <option key={stage} value={stage}>{stage}</option>
          ))}
        </select>
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm shadow-slate-200">
        <table className="min-w-full border-collapse text-left text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-6 py-4">Deal name</th>
              <th className="px-6 py-4">Contact</th>
              <th className="px-6 py-4">Stage</th>
              <th className="px-6 py-4">Value</th>
              <th className="px-6 py-4">Close date</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="7" className="px-6 py-10 text-center text-slate-500">Loading deals...</td></tr>
            ) : filteredDeals.length ? (
              filteredDeals.map((deal) => (
                <tr key={deal._id} className="border-t border-slate-100">
                  <td className="px-6 py-4 font-medium text-slate-900">{deal.name}</td>
                  <td className="px-6 py-4 text-slate-600">{deal.contact?.name || 'Unknown'}</td>
                  <td className="px-6 py-4 text-slate-600">{deal.stage}</td>
                  <td className="px-6 py-4 text-slate-900">{currency(deal.value)}</td>
                  <td className="px-6 py-4 text-slate-600">{new Date(deal.closeDate).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${deal.status === 'won' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                      {deal.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openModal(deal)} className="rounded-2xl bg-slate-100 px-3 py-2 text-slate-700 hover:bg-slate-200">
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button onClick={() => deleteDeal(deal._id)} className="rounded-2xl bg-rose-100 px-3 py-2 text-rose-600 hover:bg-rose-200">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="7" className="px-6 py-10 text-center text-slate-500">No deals found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4 py-6">
          <div className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">{activeDeal ? 'Edit deal' : 'Add deal'}</h2>
                <p className="text-sm text-slate-500">Keep your pipeline updated with new opportunities.</p>
              </div>
              <button onClick={closeModal} className="rounded-2xl bg-slate-100 px-4 py-3 text-sm text-slate-700 hover:bg-slate-200">Close</button>
            </div>
            <form onSubmit={saveDeal} className="mt-6 grid gap-4 md:grid-cols-2">
              <label className="space-y-2 text-sm text-slate-700">
                <span>Deal name</span>
                <input value={form.name} onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))} required className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100" />
              </label>
              <label className="space-y-2 text-sm text-slate-700">
                <span>Contact</span>
                <select value={form.contact} onChange={(e) => setForm((prev) => ({ ...prev, contact: e.target.value }))} required className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100">
                  <option value="">Choose contact</option>
                  {contacts.map((contact) => (
                    <option key={contact._id} value={contact._id}>{contact.name}</option>
                  ))}
                </select>
              </label>
              <label className="space-y-2 text-sm text-slate-700">
                <span>Stage</span>
                <select value={form.stage} onChange={(e) => setForm((prev) => ({ ...prev, stage: e.target.value }))} className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100">
                  {stageOptions.map((stage) => (<option key={stage} value={stage}>{stage}</option>))}
                </select>
              </label>
              <label className="space-y-2 text-sm text-slate-700">
                <span>Amount</span>
                <input type="number" value={form.value} onChange={(e) => setForm((prev) => ({ ...prev, value: Number(e.target.value) }))} className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100" />
              </label>
              <label className="space-y-2 text-sm text-slate-700 md:col-span-2">
                <span>Close date</span>
                <input type="date" value={form.closeDate} onChange={(e) => setForm((prev) => ({ ...prev, closeDate: e.target.value }))} className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100" />
              </label>
              <button type="submit" className="md:col-span-2 inline-flex justify-center rounded-3xl bg-brand-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-600">Save deal</button>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}
