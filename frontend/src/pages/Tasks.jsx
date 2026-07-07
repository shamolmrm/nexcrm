import { useEffect, useMemo, useState } from 'react';
import { tasksAPI } from '../services/api';
import { Plus, CheckCircle2, Edit3, Trash2 } from 'lucide-react';

const statusOptions = ['all', 'pending', 'in_review', 'done'];
const priorityOptions = ['all', 'low', 'medium', 'high'];

function dueLabel(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  if (date < new Date(now.toDateString())) return 'overdue';
  if (date.toDateString() === now.toDateString()) return 'today';
  return 'future';
}

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ title: '', relatedTo: '', dueDate: new Date().toISOString().slice(0, 10), priority: 'medium', status: 'pending' });
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchTasks(); }, []);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const data = await tasksAPI.getAll();
      setTasks(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(() => tasks.filter((task) => (statusFilter === 'all' || task.status === statusFilter) && (priorityFilter === 'all' || task.priority === priorityFilter)), [tasks, statusFilter, priorityFilter]);

  const saveTask = async (event) => {
    event.preventDefault();
    try {
      await tasksAPI.create(form);
      setForm({ title: '', relatedTo: '', dueDate: new Date().toISOString().slice(0, 10), priority: 'medium', status: 'pending' });
      setModalOpen(false);
      await fetchTasks();
    } catch (error) {
      console.error(error);
    }
  };

  const toggleDone = async (task) => {
    try {
      await tasksAPI.update(task._id, { ...task, status: task.status === 'done' ? 'pending' : 'done' });
      await fetchTasks();
    } catch (error) {
      console.error(error);
    }
  };

  const deleteTask = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await tasksAPI.remove(id);
      await fetchTasks();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-3xl bg-white p-6 shadow-sm shadow-slate-200 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm text-slate-500">Tasks</p>
          <h1 className="mt-2 text-2xl font-semibold text-slate-900">Keep the team on track</h1>
        </div>
        <button onClick={() => setModalOpen(true)} className="inline-flex items-center gap-2 rounded-2xl bg-brand-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-600">
          <Plus className="h-4 w-4" />
          Add task
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-[1fr_220px_220px]">
        <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-100">
          <p className="text-sm text-slate-500">Total tasks</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">{tasks.length}</p>
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm shadow-slate-100">
          {statusOptions.map((status) => (<option key={status} value={status}>{status === 'all' ? 'All status' : status}</option>))}
        </select>
        <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)} className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm shadow-slate-100">
          {priorityOptions.map((priority) => (<option key={priority} value={priority}>{priority === 'all' ? 'All priority' : priority}</option>))}
        </select>
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm shadow-slate-200">
        <table className="min-w-full border-collapse text-left text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-6 py-4">Task</th>
              <th className="px-6 py-4">Related to</th>
              <th className="px-6 py-4">Due date</th>
              <th className="px-6 py-4">Priority</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" className="px-6 py-10 text-center text-slate-500">Loading tasks...</td></tr>
            ) : filtered.length ? (
              filtered.map((task) => {
                const label = dueLabel(task.dueDate);
                return (
                  <tr key={task._id} className="border-t border-slate-100">
                    <td className="px-6 py-4 font-medium text-slate-900">{task.title}</td>
                    <td className="px-6 py-4 text-slate-600">{task.relatedTo || 'General'}</td>
                    <td className="px-6 py-4 text-slate-600">
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase ${label === 'overdue' ? 'bg-rose-100 text-rose-700' : label === 'today' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'}`}>
                        {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{task.priority}</td>
                    <td className="px-6 py-4 text-slate-900 uppercase">{task.status.replace('_', ' ')}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => toggleDone(task)} className="rounded-2xl bg-slate-100 px-3 py-2 text-slate-700 hover:bg-slate-200">
                          <CheckCircle2 className="h-4 w-4" />
                        </button>
                        <button onClick={() => deleteTask(task._id)} className="rounded-2xl bg-rose-100 px-3 py-2 text-rose-600 hover:bg-rose-200">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr><td colSpan="6" className="px-6 py-10 text-center text-slate-500">No tasks match your filters.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {modalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4 py-6">
          <div className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">New task</h2>
                <p className="text-sm text-slate-500">Track one task at a time for higher focus.</p>
              </div>
              <button onClick={() => setModalOpen(false)} className="rounded-2xl bg-slate-100 px-4 py-3 text-sm text-slate-700 hover:bg-slate-200">Close</button>
            </div>
            <form onSubmit={saveTask} className="mt-6 grid gap-4 md:grid-cols-2">
              <label className="space-y-2 text-sm text-slate-700">
                <span>Task</span>
                <input value={form.title} onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))} required className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100" />
              </label>
              <label className="space-y-2 text-sm text-slate-700">
                <span>Related to</span>
                <input value={form.relatedTo} onChange={(e) => setForm((prev) => ({ ...prev, relatedTo: e.target.value }))} className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100" />
              </label>
              <label className="space-y-2 text-sm text-slate-700">
                <span>Due date</span>
                <input type="date" value={form.dueDate} onChange={(e) => setForm((prev) => ({ ...prev, dueDate: e.target.value }))} required className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100" />
              </label>
              <label className="space-y-2 text-sm text-slate-700">
                <span>Priority</span>
                <select value={form.priority} onChange={(e) => setForm((prev) => ({ ...prev, priority: e.target.value }))} className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100">
                  {priorityOptions.filter((p) => p !== 'all').map((priority) => (<option key={priority} value={priority}>{priority}</option>))}
                </select>
              </label>
              <label className="space-y-2 text-sm text-slate-700 md:col-span-2">
                <span>Status</span>
                <select value={form.status} onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value }))} className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100">
                  <option value="pending">Pending</option>
                  <option value="in_review">In review</option>
                  <option value="done">Done</option>
                </select>
              </label>
              <button type="submit" className="md:col-span-2 inline-flex justify-center rounded-3xl bg-brand-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-600">Create task</button>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}
