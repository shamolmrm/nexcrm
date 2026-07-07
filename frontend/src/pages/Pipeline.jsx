import { useEffect, useMemo, useState } from 'react';
import { dealsAPI } from '../services/api';
import { ArrowRight, Edit3 } from 'lucide-react';

const stageOrder = ['Lead', 'Qualified', 'Proposal', 'Negotiation', 'Won'];

function stageColor(stage) {
  switch (stage) {
    case 'Qualified': return 'bg-sky-100 text-sky-700';
    case 'Proposal': return 'bg-amber-100 text-amber-700';
    case 'Negotiation': return 'bg-orange-100 text-orange-700';
    case 'Won': return 'bg-emerald-100 text-emerald-700';
    default: return 'bg-slate-100 text-slate-700';
  }
}

export default function Pipeline() {
  const [deals, setDeals] = useState([]);
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDeals();
  }, []);

  const fetchDeals = async () => {
    setLoading(true);
    try {
      const data = await dealsAPI.getAll();
      setDeals(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const grouped = useMemo(() => {
    return stageOrder.map((stage) => ({
      stage,
      items: deals.filter((deal) => deal.stage === stage),
    }));
  }, [deals]);

  const moveNext = async (deal) => {
    const currentIndex = stageOrder.indexOf(deal.stage);
    const nextStage = stageOrder[Math.min(currentIndex + 1, stageOrder.length - 1)];
    await dealsAPI.update(deal._id, { ...deal, stage: nextStage });
    fetchDeals();
  };

  const openEdit = (deal) => {
    setSelectedDeal(deal);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedDeal(null);
  };

  const saveDeal = async (event) => {
    event.preventDefault();
    try {
      await dealsAPI.update(selectedDeal._id, selectedDeal);
      await fetchDeals();
      closeModal();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white p-6 shadow-sm shadow-slate-200">
        <p className="text-sm text-slate-500">Pipeline</p>
        <h1 className="mt-2 text-2xl font-semibold text-slate-900">Kanban overview</h1>
        <p className="mt-3 text-sm text-slate-600">Track deal progress across every stage.</p>
      </div>

      <div className="grid gap-4 overflow-x-auto lg:grid-cols-5">
        {grouped.map((column) => (
          <section key={column.stage} className="min-w-[260px] rounded-3xl bg-white p-4 shadow-sm shadow-slate-200">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-slate-500">{column.stage}</p>
                <p className="mt-2 text-3xl font-semibold text-slate-900">{column.items.length}</p>
              </div>
              <p className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">${column.items.reduce((sum, deal) => sum + deal.value, 0).toLocaleString()}</p>
            </div>
            <div className="space-y-4">
              {loading ? (
                Array.from({ length: 2 }).map((_, idx) => <div key={idx} className="h-28 rounded-3xl bg-slate-100" />)
              ) : column.items.length ? (
                column.items.map((deal) => (
                  <article key={deal._id} className="rounded-3xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-semibold text-slate-900">{deal.name}</h3>
                        <p className="mt-1 text-sm text-slate-600">{deal.contact?.company || 'No company'}</p>
                      </div>
                      <button onClick={() => openEdit(deal)} className="rounded-2xl bg-white p-2 text-slate-700 shadow-sm hover:bg-slate-100">
                        <Edit3 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="mt-4 flex items-center justify-between gap-2 text-sm text-slate-600">
                      <span className="rounded-full px-2 py-1 ${stageColor(deal.stage)}">{deal.stage}</span>
                      <span className="font-semibold text-slate-900">${deal.value.toLocaleString()}</span>
                    </div>
                    <button onClick={() => moveNext(deal)} className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-brand-500 px-3 py-2 text-sm font-semibold text-white hover:bg-brand-600">
                      <ArrowRight className="h-4 w-4" />
                      Move next
                    </button>
                  </article>
                ))
              ) : (
                <p className="text-sm text-slate-500">No deals yet.</p>
              )}
            </div>
          </section>
        ))}
      </div>

      {modalOpen && selectedDeal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4 py-6">
          <div className="w-full max-w-xl rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Edit deal</h2>
                <p className="text-sm text-slate-500">Update stage or value for this opportunity.</p>
              </div>
              <button onClick={closeModal} className="rounded-2xl bg-slate-100 px-4 py-3 text-sm text-slate-700 hover:bg-slate-200">Close</button>
            </div>
            <form onSubmit={saveDeal} className="mt-6 space-y-4">
              <label className="block text-sm text-slate-700">
                <span>Name</span>
                <input value={selectedDeal.name} onChange={(e) => setSelectedDeal((prev) => ({ ...prev, name: e.target.value }))} className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100" />
              </label>
              <label className="block text-sm text-slate-700">
                <span>Stage</span>
                <select value={selectedDeal.stage} onChange={(e) => setSelectedDeal((prev) => ({ ...prev, stage: e.target.value }))} className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100">
                  {stageOrder.map((stage) => (<option key={stage} value={stage}>{stage}</option>))}
                </select>
              </label>
              <label className="block text-sm text-slate-700">
                <span>Value</span>
                <input type="number" value={selectedDeal.value} onChange={(e) => setSelectedDeal((prev) => ({ ...prev, value: Number(e.target.value) }))} className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100" />
              </label>
              <button type="submit" className="inline-flex justify-center rounded-3xl bg-brand-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-600">Update deal</button>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}
