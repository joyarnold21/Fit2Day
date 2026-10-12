import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Logo } from './Logo';
import { X, Mail, Phone, ShieldCheck, ArrowRight, Sparkles, AlertCircle } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { loginAsDemo, loginWithGoogle, loginWithPhone, loginWithEmail } = useApp();
  
  const [authMode, setAuthMode] = useState<'google' | 'phone' | 'email'>('google');
  
  // Phone form state
  const [phoneNumber, setPhoneNumber] = useState('+1 (555) 019-2834');
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpTimer, setOtpTimer] = useState(60);

  // Email form state
  const [email, setEmail] = useState('style.enthusiast@example.com');
  const [password, setPassword] = useState('password123');
  const [isSignUp, setIsSignUp] = useState(false);

  // Status & error state
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSendOtp = () => {
    if (!phoneNumber || phoneNumber.trim().length < 8) {
      setErrorMsg('Please enter a valid mobile number.');
      return;
    }
    setErrorMsg(null);
    setOtpSent(true);
    setOtpCode('');
    // Start countdown
    setOtpTimer(60);
    const interval = setInterval(() => {
      setOtpTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpSent) {
      handleSendOtp();
      return;
    }

    if (otpCode.length !== 6) {
      setErrorMsg('Please enter the 6-digit verification code.');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);
    const res = await loginWithPhone(phoneNumber, otpCode);
    setIsLoading(false);
    if (res.success) {
      onClose();
    } else {
      setErrorMsg(res.error || 'Verification failed.');
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);
    const res = await loginWithEmail(email, password);
    setIsLoading(false);
    if (res.success) {
      onClose();
    } else {
      setErrorMsg(res.error || 'Authentication failed.');
    }
  };

  const handleGoogleSubmit = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      await loginWithGoogle();
      onClose();
    } catch (err: any) {
      setErrorMsg(err?.message || 'Google sign-in error.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLaunch = () => {
    loginAsDemo();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-zinc-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="inline-block mb-3">
            <Logo size="lg" />
          </div>
          <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">
            Never Wonder What to Wear
          </h2>
          <p className="text-sm text-zinc-500 mt-1">
            Build your perfect outfits from the wardrobe you already own.
          </p>
        </div>

        {/* Development / Demo Mode Banner */}
        <div className="mb-6 p-3.5 bg-blue-50/80 border border-blue-200/80 rounded-2xl flex items-start gap-3 text-xs text-blue-900">
          <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold text-blue-950">Development / Demo Mode Active</p>
            <p className="text-blue-800/90 leading-relaxed">
              Firebase credentials are not configured in this preview environment. You can test immediately using any auth method or the 1-Click Demo account.
            </p>
          </div>
        </div>

        {/* Auth Method Tabs */}
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-zinc-100 rounded-xl mb-6">
          <button
            type="button"
            onClick={() => { setAuthMode('google'); setErrorMsg(null); }}
            className={`py-2 text-xs font-semibold rounded-lg transition-all ${
              authMode === 'google'
                ? 'bg-white text-zinc-900 shadow-xs'
                : 'text-zinc-500 hover:text-zinc-800'
            }`}
          >
            Google
          </button>
          <button
            type="button"
            onClick={() => { setAuthMode('phone'); setErrorMsg(null); }}
            className={`py-2 text-xs font-semibold rounded-lg transition-all ${
              authMode === 'phone'
                ? 'bg-white text-zinc-900 shadow-xs'
                : 'text-zinc-500 hover:text-zinc-800'
            }`}
          >
            Phone & OTP
          </button>
          <button
            type="button"
            onClick={() => { setAuthMode('email'); setErrorMsg(null); }}
            className={`py-2 text-xs font-semibold rounded-lg transition-all ${
              authMode === 'email'
                ? 'bg-white text-zinc-900 shadow-xs'
                : 'text-zinc-500 hover:text-zinc-800'
            }`}
          >
            Email
          </button>
        </div>

        {/* Error Notification */}
        {errorMsg && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-red-700">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form Contents */}
        {authMode === 'google' && (
          <div className="space-y-4">
            <button
              onClick={handleGoogleSubmit}
              disabled={isLoading}
              className="w-full py-3.5 px-4 bg-white hover:bg-zinc-50 border border-zinc-200 rounded-2xl text-sm font-semibold text-zinc-800 shadow-xs hover:shadow transition-all flex items-center justify-center gap-3 active:scale-98"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.67v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.16z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.35 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              <span>{isLoading ? 'Connecting...' : 'Continue with Google'}</span>
            </button>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-zinc-200"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-zinc-400 font-semibold">Or instant demo</span>
              </div>
            </div>

            <button
              onClick={handleDemoLaunch}
              className="w-full py-3 px-4 bg-zinc-950 hover:bg-zinc-800 text-white rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 active:scale-98 shadow-sm"
            >
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span>Continue as Demo Stylist (Alex Rivera)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {authMode === 'phone' && (
          <form onSubmit={handlePhoneSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                Mobile Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition"
                  required
                />
              </div>
            </div>

            {otpSent && (
              <div className="animate-in fade-in duration-200 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-zinc-700">
                    6-Digit SMS Verification Code
                  </label>
                  <span className="text-[11px] text-zinc-400">
                    {otpTimer > 0 ? `Resend in ${otpTimer}s` : (
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        className="text-blue-600 font-semibold hover:underline"
                      >
                        Resend Code
                      </button>
                    )}
                  </span>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="Enter 6-digit code (e.g. 123456)"
                    className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm tracking-widest font-mono text-center focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition"
                    autoFocus
                    required
                  />
                </div>
                <p className="text-[11px] text-zinc-400 text-center">
                  Demo hint: Type any 6-digit code (e.g. <strong>123456</strong>) to verify.
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-zinc-950 hover:bg-zinc-800 text-white rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 active:scale-98"
            >
              <span>{isLoading ? 'Verifying...' : otpSent ? 'Verify OTP & Continue' : 'Send Verification Code'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {authMode === 'email' && (
          <form onSubmit={handleEmailSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@domain.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition"
                required
              />
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-blue-600 font-semibold hover:underline"
              >
                {isSignUp ? 'Already have an account? Sign In' : 'New to Fit2Day? Create Account'}
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-zinc-950 hover:bg-zinc-800 text-white rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 active:scale-98"
            >
              <span>{isLoading ? 'Authenticating...' : isSignUp ? 'Create Free Account' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        <div className="mt-6 pt-4 border-t border-zinc-100 text-center">
          <p className="text-[11px] text-zinc-400">
            By signing in, you agree to our Terms of Service & Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
};
