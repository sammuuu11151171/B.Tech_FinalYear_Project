import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Mail, ArrowRight } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/common/Button';
import { Alert } from '../../components/common/Alert';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const user = await login(email, password);
      if (user.role === 'admin') {
        navigate('/admin');
      } else if (user.role === 'student') {
        navigate('/student');
      } else {
        navigate('/unauthorized');
      }
    } catch (err: any) {
      setError(err.message || 'Login failed. Please verify your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Demo accounts helper for reviewers & final year evaluation
  const setDemoAccount = (role: 'student' | 'admin') => {
    if (role === 'student') {
      setEmail('student@ovia.edu');
      setPassword('Student@ovia2026');
    } else {
      setEmail('admin@ovia.edu');
      setPassword('Admin@ovia2026');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200/80 shadow-md p-8 sm:p-10">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white font-black text-xl flex items-center justify-center mx-auto mb-3 shadow-md shadow-indigo-200">
            OV
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Sign In to OVIA</h2>
          <p className="text-xs text-slate-500 mt-1">
            Access your inclusive learning portal, quizzes, and webcam practice
          </p>
        </div>

        {error && (
          <Alert type="error" className="mb-6">
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20 outline-hidden transition-all text-slate-900"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20 outline-hidden transition-all text-slate-900"
              />
            </div>
          </div>

          <Button
            type="submit"
            isLoading={isSubmitting}
            variant="primary"
            className="w-full mt-2"
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Sign In
          </Button>
        </form>

        {/* Demo Fast-Login Section for Evaluation */}
        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2.5">
            Quick Evaluation Accounts
          </span>
          <div className="flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => setDemoAccount('student')}
              className="text-xs px-2.5 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 font-semibold border border-indigo-100 hover:bg-indigo-100 cursor-pointer"
            >
              Demo Student
            </button>
            <button
              type="button"
              onClick={() => setDemoAccount('admin')}
              className="text-xs px-2.5 py-1.5 rounded-lg bg-rose-50 text-rose-700 font-semibold border border-rose-100 hover:bg-rose-100 cursor-pointer"
            >
              Demo Admin
            </button>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-slate-500">
          Don't have an account?{' '}
          <Link to="/register" className="font-semibold text-indigo-600 hover:text-indigo-800">
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
};
