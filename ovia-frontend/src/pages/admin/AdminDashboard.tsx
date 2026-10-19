import React from 'react';
import { Activity, BookOpen, ShieldCheck, Users, ArrowUpRight, Server, Database, CircleCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card } from '../../components/common/Card';

const metrics = [
  { label: 'Registered users', value: '128', note: 'Demo overview metric', icon: <Users className="w-5 h-5" />, tone: 'indigo' },
  { label: 'Learning lessons', value: '36', note: 'Curriculum items planned', icon: <BookOpen className="w-5 h-5" />, tone: 'sky' },
  { label: 'Platform availability', value: 'Ready', note: 'Frontend preview status', icon: <Activity className="w-5 h-5" />, tone: 'emerald' },
  { label: 'Security controls', value: 'Active', note: 'Protected admin routes', icon: <ShieldCheck className="w-5 h-5" />, tone: 'violet' },
];

const quickLinks = [
  { to: '/admin/users', title: 'User & Role Management', detail: 'Review learner and staff accounts', icon: <Users className="w-5 h-5" /> },
  { to: '/admin/audit-logs', title: 'Security Audit Logs', detail: 'Review sample security events', icon: <ShieldCheck className="w-5 h-5" /> },
  { to: '/admin/system-health', title: 'System Diagnostics', detail: 'Check frontend service status', icon: <Server className="w-5 h-5" /> },
  { to: '/admin/profile', title: 'Administrator Profile', detail: 'View the current admin account', icon: <Activity className="w-5 h-5" /> },
];

export const AdminDashboard: React.FC = () => (
  <main className="min-h-full bg-slate-50 p-5 sm:p-8">
    <div className="mx-auto max-w-7xl space-y-7">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div><p className="text-sm font-semibold text-rose-600">OVIA ADMINISTRATION</p><h1 className="mt-1 text-3xl font-black tracking-tight text-slate-900">System overview</h1><p className="mt-2 text-sm text-slate-500">A central place to monitor the inclusive learning portal.</p></div>
        <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700"><CircleCheck className="h-4 w-4" /> Frontend preview</span>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((item) => <Card key={item.label} className="p-5"><div className="flex items-center justify-between"><span className="text-sm font-medium text-slate-500">{item.label}</span><span className="rounded-xl bg-slate-100 p-2 text-slate-700">{item.icon}</span></div><p className="mt-4 text-2xl font-black text-slate-900">{item.value}</p><p className="mt-1 text-xs text-slate-500">{item.note}</p></Card>)}
      </div>
      <section><div className="mb-4"><h2 className="text-lg font-bold text-slate-900">Administration tools</h2><p className="mt-1 text-sm text-slate-500">Open a module to review its current frontend screen.</p></div><div className="grid gap-4 md:grid-cols-2">{quickLinks.map((item) => <Link key={item.to} to={item.to} className="group rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-rose-200 hover:shadow-md"><div className="flex items-start gap-4"><span className="rounded-xl bg-rose-50 p-3 text-rose-700">{item.icon}</span><div className="flex-1"><h3 className="font-bold text-slate-900">{item.title}</h3><p className="mt-1 text-sm text-slate-500">{item.detail}</p></div><ArrowUpRight className="h-4 w-4 text-slate-400 group-hover:text-rose-600" /></div></Link>)}</div></section>
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900"><strong>Prototype data notice:</strong> Metrics and events on this screen are illustrative frontend data. Live account management and system health will require the backend services to be connected.</div>
    </div>
  </main>
);
