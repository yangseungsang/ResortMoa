
import React, { useState } from 'react';

interface LoginPageProps {
  onLogin: (password: string) => Promise<boolean>;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setError(false);

    try {
      const success = await onLogin(password);
      if (!success) {
        throw new Error('Invalid password');
      }
    } catch {
      setError(true);
      setShake(true);
      setTimeout(() => setShake(false), 500); // Reset shake animation
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden animate-fadeIn">
        {/* Header Section */}
        <div className="bg-teal-600 p-8 text-center">
          <div className="w-16 h-16 bg-white rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-lg">
             {/* Logo Icon */}
             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" fill="none" className="w-10 h-10">
                <rect x="0" y="0" width="40" height="40" rx="10" fill="#0d9488" />
                <path d="M10 28V14L20 22L30 14V28" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Resort Moa</h1>
          <p className="text-teal-100 text-sm mt-1 font-medium">Smart Resort Locator</p>
        </div>

        {/* Form Section */}
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-sm font-bold text-slate-700 mb-2">
                Access Code
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => {
                    setPassword(e.target.value);
                    setError(false);
                }}
                disabled={loading}
                placeholder="Enter password"
                className={`
                    w-full px-4 py-3 rounded-xl border bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all
                    ${error 
                        ? 'border-red-300 focus:ring-red-200 bg-red-50' 
                        : 'border-slate-200 focus:ring-teal-500 focus:border-teal-500'
                    }
                    ${shake ? 'animate-shake' : ''}
                `}
                autoFocus
              />
              {error && (
                <p className="text-red-500 text-xs mt-2 font-semibold ml-1">
                  Incorrect password. Please try again.
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`
                w-full font-bold py-3.5 rounded-xl shadow-lg transform transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900
                ${loading 
                    ? 'bg-slate-400 cursor-not-allowed text-slate-200' 
                    : 'bg-slate-900 hover:bg-slate-800 text-white active:scale-[0.98]'
                }
              `}
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Verifying...</span>
                </div>
              ) : (
                'Enter App'
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-xs text-slate-400">
              Authorized Personnel Only
            </p>
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
          20%, 40%, 60%, 80% { transform: translateX(4px); }
        }
        .animate-shake {
          animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both;
        }
      `}</style>
    </div>
  );
};
