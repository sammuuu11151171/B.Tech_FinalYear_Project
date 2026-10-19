import React, { useState } from 'react';
import { User, Mail, Shield, KeyRound, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { authService } from '../../services/authService';
import { TopBar } from '../../components/navigation/TopBar';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Alert } from '../../components/common/Alert';

export const ProfilePage: React.FC = () => {
  const { user, refreshProfile } = useAuth();

  const [fullName, setFullName] = useState(user?.full_name || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMsg(null);
    setIsSaving(true);

    try {
      await authService.updateProfile({
        full_name: fullName,
        current_password: currentPassword || undefined,
        new_password: newPassword || undefined,
      });
      await refreshProfile();
      setCurrentPassword('');
      setNewPassword('');
      setStatusMsg({ type: 'success', text: 'Profile details updated successfully.' });
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: err.message || 'Failed to update profile.' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      <TopBar title="Account Profile" subtitle="Manage your learner profile and security settings." />

      <div className="p-6 lg:p-8 max-w-2xl space-y-6">
        {statusMsg && (
          <Alert type={statusMsg.type}>
            {statusMsg.text}
          </Alert>
        )}

        <Card>
          <div className="flex items-center gap-4 pb-6 border-b border-slate-100 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white font-black text-2xl flex items-center justify-center">
              {user?.full_name?.charAt(0) || 'U'}
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">{user?.full_name}</h2>
              <p className="text-xs text-slate-500">{user?.email}</p>
              <div className="mt-2">
                <Badge variant="indigo" size="sm">
                  Role: {user?.role.toUpperCase()}
                </Badge>
              </div>
            </div>
          </div>

          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20 outline-hidden text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-slate-50 text-slate-500 cursor-not-allowed"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                Primary account identifier cannot be altered.
              </span>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-1.5">
                <KeyRound className="w-4 h-4 text-indigo-600" />
                Change Password (Optional)
              </h3>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-slate-600 mb-1">Current Password</label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-600 mb-1">New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter at least 6 characters"
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm outline-hidden"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <Button type="submit" isLoading={isSaving} variant="primary">
                Save Changes
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};
