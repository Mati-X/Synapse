import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Lock, Mail, User as UserIcon, Loader2, Sparkles, ArrowRight, ArrowLeft, Check } from 'lucide-react';

export interface AuthPageProps {
  initialMode?: 'login' | 'register';
  onSuccess?: () => void;
  onBack?: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({
  initialMode = 'login',
  onSuccess,
  onBack,
}) => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);
  const { login, register, isLoading, error } = useAuthStore();

  const passwordRules = [
    { id: 'min8', text: 'At least 8 characters', satisfied: password.length >= 8 },
    { id: 'hasUpper', text: 'At least one uppercase letter', satisfied: /[A-Z]/.test(password) },
    { id: 'hasNumber', text: 'At least one number', satisfied: /[0-9]/.test(password) },
    { id: 'hasSpecial', text: 'At least one special character (!@#$...)', satisfied: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password) },
  ];

  const unsatisfiedRules = passwordRules.filter((r) => !r.satisfied);
  const isPasswordValid = unsatisfiedRules.length === 0;
  const isConfirmValid = password.length > 0 && confirmPassword === password;

  const handleSuccess = () => {
    if (onSuccess) onSuccess();
    else navigate('/dashboard');
  };

  const handleBack = () => {
    if (onBack) onBack();
    else navigate('/');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (mode === 'login') {
      const ok = await login(email, password);
      if (ok) handleSuccess();
    } else {
      if (unsatisfiedRules.length > 0) {
        setLocalError(unsatisfiedRules[0].text);
        return;
      }
      if (password !== confirmPassword) {
        setLocalError('Passwords do not match');
        return;
      }
      const ok = await register(email, password, name);
      if (ok) handleSuccess();
    }
  };

  const activeError = localError || error;

  return (
    <div className="min-h-screen w-screen bg-[#070709] text-zinc-100 font-sans flex flex-col justify-between selection:bg-amber-500/30 selection:text-amber-200">
      <header className="h-16 px-6 lg:px-12 flex items-center justify-between border-b border-zinc-800/60 bg-zinc-950/40 backdrop-blur-md">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-xs font-medium text-zinc-400 hover:text-white transition-colors cursor-pointer group"
        >
          <ArrowLeft className="size-4 group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to Home</span>
        </button>

        <div className="flex items-center gap-2.5">
          <div className="size-7 rounded-lg bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center text-zinc-950 font-bold text-xs shadow-[0_0_12px_rgba(245,158,11,0.3)]">
            S
          </div>
          <span className="font-semibold text-xs tracking-tight text-white">Synapse Engine</span>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-zinc-950 border border-zinc-800/90 rounded-2xl shadow-[0_16px_48px_rgba(0,0,0,0.8)] overflow-hidden">
          <div className="p-8 pb-6 border-b border-zinc-800/80 text-center">
            <div className="size-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto mb-3 shadow-[0_0_16px_rgba(245,158,11,0.2)]">
              <Sparkles className="size-5" />
            </div>
            <h1 className="text-lg font-semibold text-zinc-100 tracking-tight">
              {mode === 'login' ? 'Sign in to Synapse Workspace' : 'Create Developer Account'}
            </h1>
            <p className="text-xs text-zinc-400 mt-1">
              {mode === 'login'
                ? 'Deterministic DAG pipeline orchestration'
                : 'Connect to live PostgreSQL cluster & start building'}
            </p>

            <div className="mt-6 p-1 bg-zinc-900 border border-zinc-800 rounded-xl grid grid-cols-2 gap-1 text-xs font-medium">
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setLocalError(null);
                }}
                className={`py-1.5 rounded-lg transition-colors cursor-pointer ${
                  mode === 'login' ? 'bg-zinc-800 text-white shadow-sm font-semibold' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setLocalError(null);
                }}
                className={`py-1.5 rounded-lg transition-colors cursor-pointer ${
                  mode === 'register' ? 'bg-zinc-800 text-white shadow-sm font-semibold' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Register
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-8 pt-6 space-y-4">
            {activeError && (
              <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800/60 text-rose-300 text-xs">
                {activeError}
              </div>
            )}

            {mode === 'register' && (
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">
                  Full Name
                </label>
                <div className="relative">
                  <UserIcon className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                  <input
                    type="text"
                    required
                    placeholder="Alex Mercer"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-amber-500/80 transition-colors"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <Mail className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="email"
                  required
                  placeholder="developer@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-amber-500/80 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <Lock className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full pl-9 pr-3 py-2 rounded-xl bg-zinc-900 border text-xs text-zinc-100 placeholder:text-zinc-600 focus:outline-none transition-colors ${
                    mode === 'register' && password.length > 0 && isPasswordValid
                      ? 'border-emerald-500/80 focus:border-emerald-500'
                      : 'border-zinc-800 focus:border-amber-500/80'
                  }`}
                />
              </div>

              {mode === 'register' && (
                <div className="pt-1">
                  {unsatisfiedRules.length > 0 && (
                    <div className="space-y-1">
                      {unsatisfiedRules.map((rule) => (
                        <div key={rule.id} className="flex items-center gap-1.5 text-[11px] font-mono text-amber-400/90 transition-all">
                          <span className="size-1 rounded-full bg-amber-400 shrink-0" />
                          <span>{rule.text}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {password.length > 0 && isPasswordValid && (
                    <div className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-400 transition-all">
                      <Check className="size-3 shrink-0" />
                      <span>All password requirements satisfied</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {mode === 'register' && (
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">
                  Repeat Password
                </label>
                <div className="relative">
                  <Lock className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`w-full pl-9 pr-3 py-2 rounded-xl bg-zinc-900 border text-xs text-zinc-100 placeholder:text-zinc-600 focus:outline-none transition-colors ${
                      confirmPassword.length > 0 && !isConfirmValid
                        ? 'border-rose-500/80 focus:border-rose-500'
                        : isConfirmValid
                        ? 'border-emerald-500/80 focus:border-emerald-500'
                        : 'border-zinc-800 focus:border-amber-500/80'
                    }`}
                  />
                </div>

                {confirmPassword.length > 0 && !isConfirmValid && (
                  <span className="text-[11px] font-mono text-rose-400 block pt-0.5">
                    Passwords do not match
                  </span>
                )}

                {isConfirmValid && (
                  <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1 pt-0.5">
                    <Check className="size-3" />
                    <span>Passwords match</span>
                  </span>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || (mode === 'register' && (!isPasswordValid || !isConfirmValid))}
              className="w-full mt-2 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-semibold text-xs shadow-[0_0_20px_rgba(245,158,11,0.35)] transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>{mode === 'login' ? 'Sign In to Workspace' : 'Create Developer Account'}</span>
                  <ArrowRight className="size-3.5" />
                </>
              )}
            </button>
          </form>
        </div>
      </main>

      <footer className="h-14 border-t border-zinc-800/60 px-6 flex items-center justify-center text-xs font-mono text-zinc-500">
        <span>PostgreSQL Native Authentication • Mission-Critical DAG Runtime</span>
      </footer>
    </div>
  );
};
