import { useEffect, useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Bell, LayoutDashboard, Users, Layers, ClipboardList, ChartPie, Mail, Settings, UserCircle2, LogOut } from 'lucide-react';
import { emailsAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/contacts', label: 'Contacts', icon: Users },
  { to: '/deals', label: 'Deals', icon: Layers },
  { to: '/pipeline', label: 'Pipeline', icon: ClipboardList },
  { to: '/tasks', label: 'Tasks', icon: ChartPie },
  { to: '/reports', label: 'Reports', icon: ChartPie },
  { to: '/emails', label: 'Emails', icon: Mail },
  { to: '/settings', label: 'Settings', icon: Settings },
  { to: '/profile', label: 'Profile', icon: UserCircle2 },
];

function NavItem({ to, label, icon: Icon, badge }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${isActive ? 'bg-brand-500 text-white' : 'text-slate-600 hover:bg-slate-100'}`
      }
    >
      <Icon className="h-5 w-5" />
      <span>{label}</span>
      {badge ? <span className="ml-auto rounded-full bg-red-500 px-2 py-0.5 text-[11px] font-semibold text-white">{badge}</span> : null}
    </NavLink>
  );
}

export default function Layout() {
  const [unread, setUnread] = useState(0);
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    emailsAPI
      .getAll()
      .then((data) => {
        if (mounted) {
          setUnread(data.filter((email) => !email.read).length);
        }
      })
      .catch(() => {
        setUnread(0);
      });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto flex min-h-screen max-w-[1600px] flex-col gap-6 px-4 py-4 md:px-6 lg:px-8">
        <header className="flex items-center justify-between gap-3 rounded-3xl bg-white p-4 shadow-sm shadow-slate-200 md:flex-row md:p-6">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-slate-500">NexCRM</p>
            <h1 className="mt-2 text-2xl font-semibold text-slate-900 md:text-3xl">Welcome back, {user?.name || 'User'}</h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setOpen((prev) => !prev)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 md:hidden"
            >
              <LayoutDashboard className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => {
                logout();
                navigate('/login');
              }}
              className="inline-flex items-center gap-2 rounded-2xl bg-slate-100 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-200"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </div>
        </header>

        <div className="grid flex-1 gap-6 lg:grid-cols-[260px_minmax(0,_1fr)]">
          <aside className={`rounded-3xl bg-white p-4 shadow-sm shadow-slate-200 transition-all md:block ${open ? 'block' : 'hidden'} lg:block`}>
            <div className="space-y-3">
              {navItems.map((item) => (
                <NavItem key={item.to} {...item} badge={item.to === '/emails' && unread > 0 ? unread : undefined} />
              ))}
            </div>
          </aside>

          <main className="rounded-3xl bg-white p-6 shadow-sm shadow-slate-200">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
