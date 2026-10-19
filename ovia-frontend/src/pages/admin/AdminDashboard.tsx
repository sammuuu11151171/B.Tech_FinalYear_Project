
import { ShieldCheck } from 'lucide-react';

export const AdminDashboard = () => {
  return (
    <main className="min-h-screen bg-slate-50 p-6 md:p-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <div className="mb-3 flex items-center gap-3">
            <ShieldCheck className="h-8 w-8 text-rose-600" />
            <h1 className="text-3xl font-bold text-slate-900">
              Admin Dashboard
            </h1>
          </div>
          <p className="text-slate-600">
            Manage and monitor the OVIA learning portal.
          </p>
        </div>

        <section className="grid gap-5 md:grid-cols-3">
          <div className="rounded-2xl border bg-white p-6">
            <h2 className="font-semibold text-slate-800">
              User Management
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              User management features can be added here.
            </p>
          </div>

          <div className="rounded-2xl border bg-white p-6">
            <h2 className="font-semibold text-slate-800">
              Learning Content
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Monitor learning materials and lessons.
            </p>
          </div>

          <div className="rounded-2xl border bg-white p-6">
            <h2 className="font-semibold text-slate-800">
              System Status
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              System monitoring can be integrated later.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
};
