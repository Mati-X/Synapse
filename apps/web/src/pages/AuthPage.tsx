import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import {
  Lock,
  Mail,
  User as UserIcon,
  Loader2,
  ArrowRight,
  ArrowLeft,
  Check,
  ShieldCheck,
  Zap,
  KeyRound,
  AlertCircle,
} from 'lucide-react';
import ambientMeshUrl from '../assets/ambient-mesh.png';
import { Particles } from '../components/reactbits/Particles';
import { BorderGlow } from '../components/reactbits/BorderGlow';
import { SpecularButton } from '../components/reactbits/SpecularButton';

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
    { id: 'min8', code: 'LEN>=8', text: 'At least 8 characters', satisfied: password.length >= 8 },
    { id: 'hasUpper', code: 'A-Z', text: 'At least one uppercase letter', satisfied: /[A-Z]/.test(password) },
    { id: 'hasNumber', code: '0-9', text: 'At least one number', satisfied: /[0-9]/.test(password) },
    {
      id: 'hasSpecial',
      code: 'SYM',
      text: 'At least one special character (!@#$...)',
      satisfied: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
    },
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

  const renderLeftPort = (label: string, variant: 'sky' | 'amber' | 'emerald' | 'rose' | 'idle') => {
    const styles = {
      sky: {
        plug: 'bg-gradient-to-r from-zinc-800 to-zinc-900 border-zinc-600/80 shadow-[0_0_8px_rgba(56,189,248,0.2),inset_0_1px_0_rgba(255,255,255,0.15)]',
        pin: 'bg-sky-400 border-sky-300 shadow-[0_0_6px_rgba(56,189,248,0.7)]',
        text: 'text-zinc-100',
      },
      amber: {
        plug: 'bg-gradient-to-r from-zinc-800 to-zinc-900 border-amber-500/50 shadow-[0_0_8px_rgba(245,158,11,0.2),inset_0_1px_0_rgba(255,255,255,0.15)]',
        pin: 'bg-amber-400 border-amber-300 shadow-[0_0_6px_rgba(245,158,11,0.7)]',
        text: 'text-amber-100',
      },
      emerald: {
        plug: 'bg-gradient-to-r from-emerald-900 to-emerald-950 border-emerald-500/80 shadow-[0_0_10px_rgba(16,185,129,0.3),inset_0_1px_0_rgba(255,255,255,0.2)]',
        pin: 'bg-emerald-400 border-emerald-300 shadow-[0_0_6px_rgba(16,185,129,0.7)]',
        text: 'text-emerald-100',
      },
      rose: {
        plug: 'bg-gradient-to-r from-rose-900 to-rose-950 border-rose-500/80 shadow-[0_0_10px_rgba(244,63,94,0.3),inset_0_1px_0_rgba(255,255,255,0.2)]',
        pin: 'bg-rose-400 border-rose-300 shadow-[0_0_6px_rgba(244,63,94,0.7)]',
        text: 'text-rose-100',
      },
    };

    return (
      <div className="relative flex items-center h-[28px] w-[62px] rounded-r-lg bg-zinc-950/95 border-y border-r border-l-0 border-zinc-800 shadow-[inset_0_2px_4px_rgba(0,0,0,0.95)] pl-0.5 shrink-0">
        {variant === 'idle' ? (
          <span className="text-[8px] font-mono font-bold tracking-wider uppercase text-zinc-600 pl-2">
            {label}
          </span>
        ) : (
          <div
            className={`w-[54px] h-[22px] flex items-center justify-between px-2 rounded-[5px] border transition-all duration-150 ${styles[variant].plug}`}
          >
            <span className={`text-[8px] font-mono font-bold tracking-wider uppercase ${styles[variant].text}`}>
              {label}
            </span>
            <div className={`w-1.5 h-3 rounded-xs border shrink-0 ${styles[variant].pin}`} />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="relative min-h-screen w-full bg-[#070709] text-zinc-100 font-sans flex flex-col justify-between selection:bg-amber-500/30 selection:text-amber-200 overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none select-none overflow-hidden z-0 bg-[#070709]">
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center opacity-45 transform-gpu blur-[24px] scale-105"
          style={{
            backgroundImage: `url(${ambientMeshUrl})`,
            backgroundRepeat: 'no-repeat',
          }}
        />
        <div
          className="absolute inset-0 opacity-25"
          style={{
            backgroundImage: 'radial-gradient(circle, #52525b 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        />
      </div>

      <Particles
        particleCount={36}
        speed={0.25}
        particleBaseSize={1.3}
        particleColors={['#38bdf8', '#10b981', '#f59e0b', '#71717a']}
        className="opacity-40"
      />

      <header className="relative z-30 h-14 bg-zinc-900/95 border-b border-zinc-800/90 px-5 lg:px-10 flex items-center justify-between backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.65)]">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <SpecularButton
            variant="secondary"
            ledColor="sky"
            shortcut="ESC"
            onClick={handleBack}
          >
            <ArrowLeft className="size-3.5" />
            <span>Back to Patchbay</span>
          </SpecularButton>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1.5 text-[10px] font-mono text-zinc-400 pr-3 border-r border-zinc-800">
              <span className="size-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(16,185,129,0.9)]" />
              <span>AUTH GATEWAY ONLINE</span>
            </span>
            <div className="size-7 font-mono font-bold text-xs rounded-lg flex items-center justify-center bg-gradient-to-br from-amber-400 to-amber-500 text-zinc-950 shadow-[0_0_12px_rgba(245,158,11,0.35),inset_0_1px_0_rgba(255,255,255,0.4)] border border-amber-300/40">
              S
            </div>
            <span className="font-semibold text-xs tracking-tight text-zinc-100">
              Synapse Engine
            </span>
          </div>
        </div>
      </header>

      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-[540px]">
          <BorderGlow
            borderRadius="1.25rem"
            accentRgb={mode === 'login' ? '56, 189, 248' : '16, 185, 129'}
            glowRadius={520}
            innerClassName="p-7 sm:p-9"
          >
            <div className="flex items-center gap-3.5 pb-4 mb-6 border-b border-zinc-800/80">
              <div className="w-11 h-11 rounded-xl bg-zinc-950/90 border border-zinc-700/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] flex items-center justify-center shrink-0 text-amber-400">
                <KeyRound className="size-5" />
              </div>

              <div className="flex flex-col min-w-0 flex-1">
                <h1 className="text-base sm:text-lg font-bold text-zinc-100 truncate tracking-tight">
                  {mode === 'login' ? 'Session Authenticator' : 'Developer Node Provisioning'}
                </h1>
                <span className="text-xs font-mono text-zinc-400 truncate opacity-85">
                  {mode === 'login'
                    ? 'PostgreSQL Identity Comparator'
                    : 'Register New Workspace Operator'}
                </span>
              </div>

              <div
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[9px] font-mono font-bold tracking-wider uppercase shrink-0 border ${
                  mode === 'login'
                    ? 'bg-sky-500/15 text-sky-400 border-sky-500/30 shadow-[0_0_8px_rgba(56,189,248,0.2)]'
                    : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30 shadow-[0_0_8px_rgba(16,185,129,0.2)]'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                    mode === 'login'
                      ? 'bg-sky-400 shadow-[0_0_6px_rgba(56,189,248,0.8)]'
                      : 'bg-emerald-400 shadow-[0_0_6px_rgba(16,185,129,0.8)]'
                  }`}
                />
                <span>{mode === 'login' ? 'SIGN IN' : 'REGISTER'}</span>
              </div>
            </div>

            <div className="p-1.5 bg-zinc-950/95 border border-zinc-800/90 rounded-xl grid grid-cols-2 gap-2 shadow-[inset_0_2px_4px_rgba(0,0,0,0.95)] mb-6">
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setLocalError(null);
                }}
                className={`h-9 px-3 rounded-lg font-mono text-xs font-bold tracking-wider uppercase flex items-center justify-between transition-all cursor-pointer ${
                  mode === 'login'
                    ? 'bg-gradient-to-b from-zinc-800 to-zinc-900 text-zinc-100 border border-zinc-600/80 shadow-[0_2px_6px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.18)]'
                    : 'text-zinc-500 hover:text-zinc-300 border border-transparent'
                }`}
              >
                <span>Sign In</span>
                <div
                  className={`w-1.5 h-3 rounded-xs border transition-all ${
                    mode === 'login'
                      ? 'bg-sky-400 border-sky-300 shadow-[0_0_6px_rgba(56,189,248,0.8)]'
                      : 'bg-zinc-800 border-zinc-700 opacity-40'
                  }`}
                />
              </button>

              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setLocalError(null);
                }}
                className={`h-9 px-3 rounded-lg font-mono text-xs font-bold tracking-wider uppercase flex items-center justify-between transition-all cursor-pointer ${
                  mode === 'register'
                    ? 'bg-gradient-to-b from-zinc-800 to-zinc-900 text-zinc-100 border border-zinc-600/80 shadow-[0_2px_6px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.18)]'
                    : 'text-zinc-500 hover:text-zinc-300 border border-transparent'
                }`}
              >
                <span>Register</span>
                <div
                  className={`w-1.5 h-3 rounded-xs border transition-all ${
                    mode === 'register'
                      ? 'bg-emerald-400 border-emerald-300 shadow-[0_0_6px_rgba(16,185,129,0.8)]'
                      : 'bg-zinc-800 border-zinc-700 opacity-40'
                  }`}
                />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {activeError && (
                <div className="px-3.5 py-2.5 rounded-lg bg-rose-950/60 border border-rose-500/40 shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.75)] flex items-center gap-2.5 text-rose-300 text-xs font-mono">
                  <AlertCircle className="size-4 text-rose-400 shrink-0" />
                  <span>{activeError}</span>
                </div>
              )}

              {mode === 'register' && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between px-0.5">
                    <span className="flex items-center gap-1.5 text-xs font-mono text-zinc-400 uppercase tracking-wider">
                      <span className="flex items-center gap-1 text-[9px] font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 px-1.5 py-0.5 rounded">
                        <Zap className="w-2.5 h-2.5" />
                        USER
                      </span>
                      <span>.display_name</span>
                    </span>
                    <span className="text-[10px] font-mono text-zinc-500">STRING</span>
                  </div>

                  <div className="flex items-center -ml-6">
                    {renderLeftPort('USR', name.trim().length > 0 ? 'emerald' : 'idle')}
                    <div className="relative flex-1 ml-2.5">
                      <UserIcon className="size-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
                      <input
                        type="text"
                        required
                        placeholder="Alex Mercer"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-zinc-950/90 hover:bg-zinc-900 border border-zinc-800/90 focus:border-amber-400/80 shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.75)] text-sm font-mono text-zinc-100 placeholder:text-zinc-600 focus:outline-none transition-colors"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <div className="flex items-center justify-between px-0.5">
                  <span className="flex items-center gap-1.5 text-xs font-mono text-zinc-400 uppercase tracking-wider">
                    <span className="flex items-center gap-1 text-[9px] font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 px-1.5 py-0.5 rounded">
                      <Zap className="w-2.5 h-2.5" />
                      AUTH
                    </span>
                    <span>.email_address</span>
                  </span>
                  <span className="text-[10px] font-mono text-zinc-500">UNIQUE</span>
                </div>

                <div className="flex items-center -ml-6">
                  {renderLeftPort('IN A', email.includes('@') ? 'sky' : 'idle')}
                  <div className="relative flex-1 ml-2.5">
                    <Mail className="size-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
                    <input
                      type="email"
                      required
                      placeholder="developer@synapse.io"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-zinc-950/90 hover:bg-zinc-900 border border-zinc-800/90 focus:border-sky-400/80 shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.75)] text-sm font-mono text-zinc-100 placeholder:text-zinc-600 focus:outline-none transition-colors"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between px-0.5">
                  <span className="flex items-center gap-1.5 text-xs font-mono text-zinc-400 uppercase tracking-wider">
                    <span className="flex items-center gap-1 text-[9px] font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 px-1.5 py-0.5 rounded">
                      <Zap className="w-2.5 h-2.5" />
                      SEC
                    </span>
                    <span>.password_secret</span>
                  </span>
                  <span className="text-[10px] font-mono text-zinc-500">ENCRYPTED</span>
                </div>

                <div className="flex items-center -ml-6">
                  {renderLeftPort(
                    'KEY',
                    password.length === 0
                      ? 'idle'
                      : mode === 'login'
                      ? 'sky'
                      : isPasswordValid
                      ? 'emerald'
                      : 'amber'
                  )}
                  <div className="relative flex-1 ml-2.5">
                    <Lock className="size-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
                    <input
                      type="password"
                      required
                      placeholder="••••••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-zinc-950/90 hover:bg-zinc-900 border shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.75)] text-sm font-mono text-zinc-100 placeholder:text-zinc-600 focus:outline-none transition-colors ${
                        mode === 'register' && password.length > 0 && isPasswordValid
                          ? 'border-emerald-500/70 focus:border-emerald-400'
                          : 'border-zinc-800/90 focus:border-amber-400/80'
                      }`}
                    />
                  </div>
                </div>

                {mode === 'register' && (
                  <div className="pt-1">
                    {unsatisfiedRules.length > 0 && (
                      <div className="bg-zinc-950/90 border border-zinc-800/90 rounded-lg p-2.5 shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.75)] space-y-1.5">
                        {unsatisfiedRules.map((rule) => (
                          <div
                            key={rule.id}
                            className="flex items-center justify-between text-[11px] font-mono text-zinc-300"
                          >
                            <div className="flex items-center gap-2">
                              <span className="w-1.5 h-2.5 rounded-xs bg-amber-400/90 shadow-[0_0_5px_rgba(245,158,11,0.7)] shrink-0" />
                              <span>{rule.text}</span>
                            </div>
                            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-zinc-900 border border-zinc-800 text-amber-400/90">
                              {rule.code}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {password.length > 0 && isPasswordValid && (
                      <div className="px-3 py-1.5 rounded-lg bg-emerald-950/40 border border-emerald-500/35 flex items-center justify-between text-[11px] font-mono text-emerald-300">
                        <span className="flex items-center gap-1.5">
                          <Check className="size-3.5 text-emerald-400 shrink-0" />
                          <span>All password requirements satisfied</span>
                        </span>
                        <span className="text-[9px] font-bold uppercase text-emerald-400">VALID</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {mode === 'register' && (
                <div className="space-y-1.5">
                  <div className="relative flex items-center justify-center py-1">
                    <div className="w-full h-px bg-zinc-800/80" />
                    <div className="absolute bg-gradient-to-b from-zinc-800 to-zinc-900 border border-zinc-600/90 rounded-md px-2.5 py-0.5 shadow-[0_2px_6px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.18)] flex items-center gap-1.5">
                      <span className="text-[10px] font-mono font-bold text-amber-300">===</span>
                      <span className="text-[9px] font-mono text-zinc-300 uppercase tracking-wider">
                        VERIFY MATCH
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between px-0.5">
                    <span className="flex items-center gap-1.5 text-xs font-mono text-zinc-400 uppercase tracking-wider">
                      <span className="flex items-center gap-1 text-[9px] font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 px-1.5 py-0.5 rounded">
                        <Zap className="w-2.5 h-2.5" />
                        SYNC
                      </span>
                      <span>.repeat_password</span>
                    </span>
                    <span className="text-[10px] font-mono text-zinc-500">CONFIRM</span>
                  </div>

                  <div className="flex items-center -ml-6">
                    {renderLeftPort(
                      'IN B',
                      confirmPassword.length === 0
                        ? 'idle'
                        : isConfirmValid
                        ? 'emerald'
                        : 'rose'
                    )}
                    <div className="relative flex-1 ml-2.5">
                      <Lock className="size-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
                      <input
                        type="password"
                        required
                        placeholder="••••••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className={`w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-zinc-950/90 hover:bg-zinc-900 border shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.75)] text-sm font-mono text-zinc-100 placeholder:text-zinc-600 focus:outline-none transition-colors ${
                          confirmPassword.length > 0 && !isConfirmValid
                            ? 'border-rose-500/70 focus:border-rose-400'
                            : isConfirmValid
                            ? 'border-emerald-500/70 focus:border-emerald-400'
                            : 'border-zinc-800/90 focus:border-amber-400/80'
                        }`}
                      />
                    </div>
                  </div>

                  {confirmPassword.length > 0 && !isConfirmValid && (
                    <div className="px-3 py-1.5 rounded-lg bg-rose-950/40 border border-rose-500/35 flex items-center justify-between text-[11px] font-mono text-rose-300">
                      <span>Passwords do not match</span>
                      <span className="text-[9px] font-bold uppercase text-rose-400">FALSE</span>
                    </div>
                  )}

                  {isConfirmValid && (
                    <div className="px-3 py-1.5 rounded-lg bg-emerald-950/40 border border-emerald-500/35 flex items-center justify-between text-[11px] font-mono text-emerald-300">
                      <span className="flex items-center gap-1.5">
                        <Check className="size-3.5 text-emerald-400" />
                        <span>Passwords match</span>
                      </span>
                      <span className="text-[9px] font-bold uppercase text-emerald-400">TRUE</span>
                    </div>
                  )}
                </div>
              )}

              <div className="pt-3">
                <SpecularButton
                  type="submit"
                  variant={mode === 'login' ? 'primary' : 'emerald'}
                  ledColor={mode === 'login' ? 'sky' : 'emerald'}
                  shortcut="↵"
                  disabled={isLoading || (mode === 'register' && (!isPasswordValid || !isConfirmValid))}
                  className="w-full [&>div]:w-full text-xs sm:text-sm py-2.5 disabled:opacity-40 disabled:pointer-events-none"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      <span>Executing Auth Handshake...</span>
                    </>
                  ) : (
                    <>
                      <span>
                        {mode === 'login' ? 'Sign In to Workspace' : 'Create Developer Account'}
                      </span>
                      <ArrowRight className="size-4" />
                    </>
                  )}
                </SpecularButton>
              </div>
            </form>
          </BorderGlow>
        </div>
      </main>

      <footer className="relative z-10 h-10 border-t border-zinc-800/80 bg-zinc-950/95 text-zinc-400 text-[11px] font-mono select-none flex items-center justify-between px-6 lg:px-12">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="size-3.5 text-emerald-400" />
            <span className="font-semibold text-zinc-300">SECURE GATEWAY</span>
          </div>
          <div className="flex items-center gap-3 text-[10px] text-zinc-500">
            <span className="bg-zinc-900 border border-zinc-800 px-1.5 py-0.5 rounded text-zinc-400">
              Salted Hash
            </span>
            <span className="bg-zinc-900 border border-zinc-800 px-1.5 py-0.5 rounded text-zinc-400">
              UUIDv4 Session
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};
