import React, { useState } from 'react';
import { useApp, ADMIN_EMAIL } from '../context/AppContext';
import {
  User,
  Lock,
  Mail,
  Phone,
  X,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Users,
  ShieldAlert,
  Crown,
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    currentUser,
    userProfile,
    loginWithEmailPassword,
    registerWithEmailPassword,
    logoutUser,
    showToast,
    restaurantSettings,
    setActiveTab,
    isSuperAdmin,
  } = useApp();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!emailOrUsername.trim()) {
      setError('Please enter your username or email address.');
      return;
    }

    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    try {
      if (mode === 'register') {
        if (!name.trim()) {
          setError('Please provide your full name.');
          setLoading(false);
          return;
        }
        await registerWithEmailPassword(name.trim(), emailOrUsername.trim(), password, phone.trim());
        showToast(`Welcome, ${name}! Your account was created successfully.`, 'success');
      } else {
        await loginWithEmailPassword(emailOrUsername.trim(), password);
        showToast('Logged in successfully!', 'success');
      }
      setIsAuthModalOpen(false);
    } catch (err: any) {
      console.error('Auth error:', err);
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError('Invalid username/email or password. If you are new, click "Create Account".');
      } else if (err.code === 'auth/email-already-in-use') {
        setError('An account with this username or email already exists. Please Sign In.');
      } else if (err.code === 'auth/weak-password') {
        setError('Password is too weak. Please use at least 6 characters.');
      } else {
        setError(err.message || 'Authentication failed. Please check your credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoAccount = async (demoName: string, demoEmail: string, demoPass: string) => {
    setName(demoName);
    setEmailOrUsername(demoEmail);
    setPassword(demoPass);
    setError(null);
    setLoading(true);
    try {
      try {
        await loginWithEmailPassword(demoEmail, demoPass);
        showToast(`Logged in as ${demoName}`, 'success');
      } catch (loginErr: any) {
        // If not registered yet, auto-register this demo profile
        if (loginErr.code === 'auth/user-not-found' || loginErr.code === 'auth/invalid-credential') {
          await registerWithEmailPassword(demoName, demoEmail, demoPass);
          showToast(`Created & logged in as ${demoName}`, 'success');
        } else {
          throw loginErr;
        }
      }
      setIsAuthModalOpen(false);
    } catch (err: any) {
      setError(err.message || 'Failed to switch demo account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      id="firebase-auth-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={() => setIsAuthModalOpen(false)}
    >
      <div
        id="firebase-auth-modal-dialog"
        className="bg-white rounded-3xl overflow-hidden max-w-md w-full max-h-[92vh] flex flex-col shadow-2xl border border-[#E6DEC8] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#143627] text-white p-6 relative shrink-0">
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="absolute top-4 right-4 text-white/80 hover:text-white w-8 h-8 rounded-full bg-white/10 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-emerald-200 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-[#C69234]" />
              Username & Password Authentication
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold font-cinzel">
            {currentUser ? 'Your Account' : mode === 'login' ? 'Sign In with Credentials' : 'Create Your Account'}
          </h2>
          <p className="text-xs text-emerald-100/80 mt-1">
            Access your orders, cart, and favourites with your username and password.
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {currentUser ? (
            /* Logged In View */
            <div className="space-y-4">
              <div className={`p-4 rounded-2xl border flex items-center gap-3 ${
                isSuperAdmin ? 'bg-amber-50/80 border-amber-300' : 'bg-emerald-50 border-emerald-200'
              }`}>
                <div className={`w-12 h-12 rounded-full text-white flex items-center justify-center font-bold text-lg ${
                  isSuperAdmin ? 'bg-[#143627] text-amber-300 shadow-md ring-2 ring-amber-400' : 'bg-emerald-700'
                }`}>
                  {isSuperAdmin ? '👑' : (userProfile?.name?.charAt(0) || currentUser.displayName?.charAt(0) || 'U')}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-bold text-sm text-[#143627]">
                      {isSuperAdmin ? 'Bhavnoor Singh Kochar (Administrator)' : (userProfile?.name || currentUser.displayName || 'Authenticated Diner')}
                    </h3>
                  </div>
                  <p className="text-xs text-[#65736C]">
                    {currentUser.email || 'Email user'}
                  </p>
                  <span className={`inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded ${
                    isSuperAdmin ? 'bg-amber-200 text-amber-900' : 'bg-emerald-200 text-emerald-900'
                  }`}>
                    {isSuperAdmin ? 'Role: Owner & Admin (Direct Admin App Access)' : 'Role: Customer (Private Cart & Orders)'}
                  </span>
                </div>
              </div>

              <div className="text-xs text-[#65736C] space-y-1">
                {isSuperAdmin ? (
                  <p className="flex items-center gap-1 text-amber-800 font-semibold">
                    <ShieldCheck className="w-4 h-4 text-[#C69234]" />
                    You are verified as the administrator with full management rights.
                  </p>
                ) : (
                  <p className="flex items-center gap-1 text-emerald-700 font-semibold">
                    <CheckCircle2 className="w-4 h-4" />
                    Your personal cart, orders, and favourites are saved privately in Firestore.
                  </p>
                )}
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center gap-2">
                {isSuperAdmin ? (
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('admin');
                      setIsAuthModalOpen(false);
                    }}
                    className="w-full py-2.5 rounded-xl bg-[#143627] hover:bg-[#235D43] text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2"
                  >
                    <Crown className="w-4 h-4 text-amber-400" />
                    <span>Open Admin App</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('menu');
                      setIsAuthModalOpen(false);
                    }}
                    className="w-full py-2.5 rounded-xl bg-[#143627] hover:bg-[#235D43] text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2"
                  >
                    <span>Browse Customer Menu</span>
                  </button>
                )}

                <div className="flex w-full sm:w-auto items-center gap-2">
                  <button
                    type="button"
                    onClick={async () => {
                      await logoutUser();
                      showToast('Logged out successfully', 'info');
                    }}
                    className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-rose-300 text-rose-700 hover:bg-rose-50 text-xs font-bold transition-colors"
                  >
                    Log Out
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAuthModalOpen(false)}
                    className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-[#143627] text-xs font-bold transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Login / Registration Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Tab Selector: Login vs Register */}
              <div className="grid grid-cols-2 p-1 rounded-xl bg-[#FAF7F2] border border-[#E6DEC8]">
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setError(null);
                  }}
                  className={`py-2 text-xs font-bold rounded-lg transition-all ${
                    mode === 'login'
                      ? 'bg-white text-[#143627] shadow-xs'
                      : 'text-[#65736C] hover:text-[#143627]'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode('register');
                    setError(null);
                  }}
                  className={`py-2 text-xs font-bold rounded-lg transition-all ${
                    mode === 'register'
                      ? 'bg-white text-[#143627] shadow-xs'
                      : 'text-[#65736C] hover:text-[#143627]'
                  }`}
                >
                  Create Account
                </button>
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
                  <span className="leading-relaxed">{error}</span>
                </div>
              )}

              {/* Full Name field in register mode */}
              {mode === 'register' && (
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[#65736C]">Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Bhavnoor Singh"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#E6DEC8] text-xs font-semibold focus:outline-none focus:border-[#2E7D58] bg-white"
                    />
                  </div>
                </div>
              )}

              {/* Name / Email / Username Input */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold text-[#65736C]">
                    {mode === 'register' ? 'Choose Username or Email' : 'Username or Email'}
                  </label>
                  {emailOrUsername.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase() ||
                  emailOrUsername.trim().toLowerCase() === 'bhavnoorsinghkochar' ? (
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded flex items-center gap-1">
                      <Crown className="w-3 h-3 text-amber-600" />
                      Admin Access
                    </span>
                  ) : (
                    <span className="text-[10px] text-emerald-700 font-medium">
                      Direct Credentials Login
                    </span>
                  )}
                </div>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    required
                    value={emailOrUsername}
                    onChange={(e) => setEmailOrUsername(e.target.value)}
                    placeholder={mode === 'register' ? 'e.g. bhavnoor or customer@example.com' : 'Enter username or email'}
                    className={`w-full pl-9 pr-3 py-2.5 rounded-xl border text-xs font-semibold focus:outline-none bg-white ${
                      emailOrUsername.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase() ||
                      emailOrUsername.trim().toLowerCase() === 'bhavnoorsinghkochar'
                        ? 'border-amber-400 ring-2 ring-amber-200'
                        : 'border-[#E6DEC8] focus:border-[#2E7D58]'
                    }`}
                  />
                </div>
                <p className="text-[10px] text-[#65736C]">
                  {emailOrUsername.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase() ||
                  emailOrUsername.trim().toLowerCase() === 'bhavnoorsinghkochar'
                    ? '✨ Admin credentials detected: signing in will launch the Admin App.'
                    : 'You can enter your custom username or your email address with your password.'}
                </p>
              </div>

              {/* Password Input */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold text-[#65736C]">Password</label>
                  <span className="text-[10px] text-gray-400">Min. 6 chars</span>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#E6DEC8] text-xs font-semibold focus:outline-none focus:border-[#2E7D58] bg-white"
                  />
                </div>
              </div>

              {/* Optional Phone in register mode */}
              {mode === 'register' && (
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[#65736C]">Phone Number (Optional)</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#E6DEC8] text-xs font-semibold focus:outline-none focus:border-[#2E7D58] bg-white"
                    />
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-[#143627] hover:bg-[#235D43] text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {loading ? (
                  <span>Processing...</span>
                ) : (
                  <>
                    <span>{mode === 'login' ? 'Sign In with Username & Password' : 'Create Account & Start Ordering'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Security Banner: Username & Password only */}
              <div className="p-2.5 rounded-xl bg-[#FAF7F2] border border-[#E6DEC8] flex items-center gap-2 text-[11px] text-[#65736C]">
                <Lock className="w-3.5 h-3.5 text-[#2E7D58] shrink-0" />
                <span>Protected with username and password login. No third-party accounts required.</span>
              </div>

              {/* Quick Switch Accounts (Role & Data Isolation Testing) */}
              <div className="pt-2 border-t border-[#E6DEC8]">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-bold text-[#65736C] uppercase tracking-wider">
                    ⚡ Quick Test Logins:
                  </span>
                  <span className="text-[10px] text-amber-700 font-semibold">
                    Strict Role Separation
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      handleQuickDemoAccount(
                        'Bhavnoor Singh Kochar',
                        ADMIN_EMAIL,
                        'bhavnoor123456'
                      )
                    }
                    className="p-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-left transition-colors relative group"
                  >
                    <div className="flex items-center gap-1.5">
                      <Crown className="w-3.5 h-3.5 text-amber-600" />
                      <span className="text-[11px] font-bold text-amber-950">
                        Admin App Access
                      </span>
                    </div>
                    <span className="text-[10px] text-amber-800 font-semibold block truncate">
                      {ADMIN_EMAIL}
                    </span>
                    <span className="text-[9px] text-amber-600/80 block mt-0.5">
                      Directly opens Admin Portal
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleQuickDemoAccount(
                        'Priya Sharma',
                        'priya.sharma@demo.com',
                        'priya123456'
                      )
                    }
                    className="p-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-left transition-colors"
                  >
                    <div className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-emerald-700" />
                      <span className="text-[11px] font-bold text-emerald-950">
                        Customer App Access
                      </span>
                    </div>
                    <span className="text-[10px] text-emerald-800 font-semibold block">
                      priya.sharma@demo.com
                    </span>
                    <span className="text-[9px] text-emerald-600/80 block mt-0.5">
                      Private Cart & Orders
                    </span>
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
