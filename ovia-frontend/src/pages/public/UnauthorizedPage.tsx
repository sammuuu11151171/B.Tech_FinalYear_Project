import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldX, ArrowLeft } from 'lucide-react';
import { Button } from '../../components/common/Button';

export const UnauthorizedPage: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6 text-center">
      <div className="max-w-md bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
        <ShieldX className="w-16 h-16 text-rose-500 mx-auto mb-4" />
        <h1 className="text-2xl font-black text-slate-900 mb-2">Access Denied</h1>
        <p className="text-sm text-slate-600 mb-6 leading-relaxed">
          You do not have the required permissions to view this section of the portal. Role restrictions are enforced by server-side authorization guards.
        </p>
        <Link to="/">
          <Button variant="primary" leftIcon={<ArrowLeft className="w-4 h-4" />}>
            Return to Home
          </Button>
        </Link>
      </div>
    </div>
  );
};
