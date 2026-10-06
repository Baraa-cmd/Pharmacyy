import React, { useState } from 'react';
import { X, Lock, User, Shield, Stethoscope, Pill, AlertCircle, CheckCircle2 } from 'lucide-react';
import { SystemUser } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: SystemUser[];
  onLogin: (user: SystemUser) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, users, onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const foundUser = users.find(
      (u) => u.username.toLowerCase() === username.trim().toLowerCase() && u.password === password
    );

    if (!foundUser) {
      setError('اسم المستخدم أو كلمة المرور غير صحيحة.');
      return;
    }

    if (foundUser.status === 'suspended') {
      setError('هذا الحساب معلق من قبل إدارة النظام. يرجى مراجعة الإدارة.');
      return;
    }

    onLogin(foundUser);
    onClose();
  };

  const handleQuickLogin = (uName: string, pWord: string) => {
    setUsername(uName);
    setPassword(pWord);
    const foundUser = users.find(
      (u) => u.username.toLowerCase() === uName.toLowerCase() && u.password === pWord
    );
    if (foundUser) {
      onLogin(foundUser);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden relative">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-800 to-teal-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 left-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition text-white"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-2xl mb-3 border border-white/20">
            🔐
          </div>
          <h2 className="text-xl font-black tracking-tight">تسجيل الدخول إلى النظام</h2>
          <p className="text-teal-200 text-xs mt-1">بوابة الإدارة الطبية وحسابات الأطباء والصيادلة</p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleLoginSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">اسم المستخدم (Username)</label>
            <div className="relative">
              <span className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400">
                <User className="w-4 h-4" />
              </span>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="أدخل اسم المستخدم..."
                className="w-full pr-10 pl-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-teal-600 bg-slate-50/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">كلمة المرور (Password)</label>
            <div className="relative">
              <span className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pr-10 pl-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-teal-600 bg-slate-50/50"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-sm shadow-md transition active:scale-95"
          >
            تسجيل الدخول
          </button>

          {/* Quick Demo Credentials Box */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <div className="text-[11px] font-bold text-slate-500 mb-2.5 flex items-center gap-1.5">
              <span>⚡ تجربة سريعة (الحسابات الافتراضية):</span>
            </div>
            <div className="grid grid-cols-1 gap-2">
              {/* Admin */}
              <button
                type="button"
                onClick={() => handleQuickLogin('admin', 'admin123')}
                className="flex items-center justify-between p-2.5 rounded-xl bg-teal-50 hover:bg-teal-100 border border-teal-200 transition text-right"
              >
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-teal-700 text-white flex items-center justify-center shrink-0">
                    <Shield className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-teal-900">مدير النظام (Admin)</div>
                    <div className="text-[10px] text-teal-600">username: <code className="bg-white px-1 rounded">admin</code> | pass: <code className="bg-white px-1 rounded">admin123</code></div>
                  </div>
                </div>
                <span className="text-[11px] bg-teal-700 text-white px-2 py-1 rounded-lg font-bold">دخول</span>
              </button>

              {/* Doctor */}
              <button
                type="button"
                onClick={() => handleQuickLogin('dr.ahmad', '123456')}
                className="flex items-center justify-between p-2.5 rounded-xl bg-sky-50 hover:bg-sky-100 border border-sky-200 transition text-right"
              >
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-sky-700 text-white flex items-center justify-center shrink-0">
                    <Stethoscope className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-sky-900">طبيب (د. أحمد المحمد)</div>
                    <div className="text-[10px] text-sky-600">username: <code className="bg-white px-1 rounded">dr.ahmad</code></div>
                  </div>
                </div>
                <span className="text-[11px] bg-sky-700 text-white px-2 py-1 rounded-lg font-bold">دخول</span>
              </button>

              {/* Pharmacy */}
              <button
                type="button"
                onClick={() => handleQuickLogin('pharmacy.salam', '123456')}
                className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition text-right"
              >
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-700 text-white flex items-center justify-center shrink-0">
                    <Pill className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-emerald-900">صيدلية (صيدلية السلام)</div>
                    <div className="text-[10px] text-emerald-600">username: <code className="bg-white px-1 rounded">pharmacy.salam</code></div>
                  </div>
                </div>
                <span className="text-[11px] bg-emerald-700 text-white px-2 py-1 rounded-lg font-bold">دخول</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
