import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Lock, ShieldAlert, UserCheck } from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { adminLogin } = useApp();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const success = adminLogin(username, password);
    if (success) {
      onSuccess();
      onClose();
    } else {
      setErrorMsg('Invalid admin credentials. Please try again.');
    }
  };

  return (
    <div
      id="admin-login-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in"
      onClick={onClose}
    >
      <div
        id="admin-login-card"
        className="bg-white rounded-3xl overflow-hidden max-w-sm w-full shadow-2xl border border-[#E6DEC8] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 bg-[#143627] text-white text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/70 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-2 text-[#C69234]">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="font-cinzel text-xl font-bold tracking-wide">
            Staff & Admin Portal
          </h3>
          <p className="text-xs text-red-200/90 mt-1">
            Laa Mamma Mia! Taste Of Singapore · Rajguru Nagar
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#143627] mb-1">
              Admin Username / Email
            </label>
            <input
              id="admin-username-input"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. admin"
              className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#E6DEC8] rounded-xl text-sm focus:outline-none focus:border-[#235D43]"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#143627] mb-1">
              Password
            </label>
            <input
              id="admin-password-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#E6DEC8] rounded-xl text-sm focus:outline-none focus:border-[#235D43]"
              required
            />
          </div>

          <button
            id="admin-submit-btn"
            type="submit"
            className="w-full py-3 rounded-xl bg-[#143627] hover:bg-[#235D43] text-white font-bold text-sm shadow-md transition-all active:scale-98"
          >
            Access Admin Dashboard
          </button>
        </form>
      </div>
    </div>
  );
};
