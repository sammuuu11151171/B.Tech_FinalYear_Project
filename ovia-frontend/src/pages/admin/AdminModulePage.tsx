import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Clock3, Database, ShieldCheck, Users, Activity, UserRound } from 'lucide-react';
import { Card } from '../../components/common/Card';
import { useAuth } from '../../contexts/AuthContext';

const modules: Record<string, { title: string; subtitle: string; icon: React.ReactNode }> = {
  '/admin/users': { title: 'User & Role Management', subtitle: 'Review the planned account management area for OVIA.', icon: <Users className="h-6 w-6" /> },
  '/admin/audit-logs': { title: 'Security Audit Logs', subtitle: 'Review example events that an audit trail can display.', icon: <ShieldCheck className="h-6 w-6" /> },
  '/admin/system-health': { title: 'System Diagnostics', subtitle: 'View the current frontend preview status and integration checklist.', icon: <Activity className="h-6 w-6" /> },
  '/admin/profile': { title: 'Administrator Profile', subtitle: 'View your current administrator account information.', icon: <UserRound className="h-6 w-6" /> },
};

const demoUsers = [
  { name: 'Aarav Sharma', email: 'aarav.student@example.com', role: 'Student', status: 'Active' },
  { name: 'Diya Patil', email: 'diya.student@example.com', role: 'Student', status: 'Active' },
  { name: 'OVIA Administrator', email: 'admin@example.com', role: 'Admin', status: 'Active' },
];

export const AdminModulePage: React.FC = () => {
  const { pathname } = useLocation();
  const { user } = useAuth();
  const page = modules[pathname] ?? modules['/admin/users'];
  return <main className="min-h-full bg-slate-50 p-5 sm:p-8"><div className="mx-auto max-w-6xl space-y-6">
    <Link to="/admin" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-rose-700"><ArrowLeft className="h-4 w-4" /> Back to overview</Link>
    <div className="flex items-start gap-4"><span className="rounded-2xl bg-rose-100 p-3 text-rose-700">{page.icon}</span><div><h1 className="text-2xl font-black text-slate-900">{page.title}</h1><p className="mt-1 text-sm text-slate-500">{page.subtitle}</p></div></div>
    {pathname === '/admin/users' ? <Card className="overflow-hidden p-0"><div className="border-b border-slate-100 p-5"><h2 className="font-bold text-slate-900">Sample user directory</h2><p className="mt-1 text-xs text-slate-500">Illustrative rows only; not fetched from the database.</p></div><div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr><th className="px-5 py-3">Name</th><th className="px-5 py-3">Email</th><th className="px-5 py-3">Role</th><th className="px-5 py-3">Status</th></tr></thead><tbody>{demoUsers.map((item) => <tr key={item.email} className="border-t border-slate-100"><td className="px-5 py-4 font-semibold text-slate-800">{item.name}</td><td className="px-5 py-4 text-slate-600">{item.email}</td><td className="px-5 py-4">{item.role}</td><td className="px-5 py-4"><span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">{item.status}</span></td></tr>)}</tbody></table></div></Card> : null}
    {pathname === '/admin/audit-logs' ? <Card><h2 className="font-bold text-slate-900">Recent sample events</h2><div className="mt-4 space-y-3">{[{title:'Admin dashboard opened', time:'Just now', detail:'Administrator opened the overview page.'},{title:'Role checks enabled',time:'Today',detail:'Admin routes require an authenticated admin account.'},{title:'Learning portal preview ready',time:'Today',detail:'Frontend routes are available for testing.'}].map((event) => <div key={event.title} className="flex gap-3 rounded-xl bg-slate-50 p-4"><Clock3 className="mt-0.5 h-4 w-4 text-slate-500"/><div><p className="text-sm font-semibold text-slate-800">{event.title}</p><p className="mt-1 text-xs text-slate-500">{event.detail}</p><p className="mt-1 text-[11px] text-slate-400">{event.time}</p></div></div>)}</div></Card> : null}
    {pathname === '/admin/system-health' ? <div className="grid gap-4 md:grid-cols-2">{[{name:'Frontend application',desc:'React + TypeScript + Vite',icon:<CheckCircle2 className="h-5 w-5"/>},{name:'API connection',desc:'Requires backend server to be running',icon:<Database className="h-5 w-5"/>},{name:'Authentication',desc:'Protected routes use AuthContext',icon:<ShieldCheck className="h-5 w-5"/>},{name:'Learning content',desc:'Lesson and quiz pages are connected to service modules',icon:<Activity className="h-5 w-5"/>}].map((item) => <Card key={item.name}><div className="flex gap-3"><span className="text-emerald-600">{item.icon}</span><div><h3 className="font-bold text-slate-900">{item.name}</h3><p className="mt-1 text-sm text-slate-500">{item.desc}</p></div></div></Card>)}</div> : null}
    {pathname === '/admin/profile' ? <Card><div className="flex items-center gap-4"><div className="flex h-14 w-14 items-center justify-center rounded-full bg-rose-100 text-xl font-bold text-rose-700">{(user?.full_name ?? 'A').slice(0,1).toUpperCase()}</div><div><h2 className="font-bold text-slate-900">{user?.full_name ?? 'Administrator'}</h2><p className="text-sm text-slate-500">{user?.email ?? 'No email available'}</p></div></div><dl className="mt-6 grid gap-4 border-t border-slate-100 pt-5 sm:grid-cols-2"><div><dt className="text-xs font-semibold uppercase text-slate-400">Role</dt><dd className="mt-1 text-sm font-medium capitalize text-slate-800">{user?.role ?? 'admin'}</dd></div><div><dt className="text-xs font-semibold uppercase text-slate-400">Account status</dt><dd className="mt-1 text-sm font-medium text-emerald-700">{user?.is_active === false ? 'Inactive' : 'Active'}</dd></div></dl></Card> : null}
    <p className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900"><strong>Prototype note:</strong> This page is implemented as a frontend module. Connect the corresponding API endpoints before using it to manage real accounts, audit records, or system diagnostics.</p>
  </div></main>;
};
