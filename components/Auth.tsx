
import React, { useState } from 'react';
import { User } from '../types';
import { Activity, ShieldCheck, Globe, Trophy, Loader2 } from 'lucide-react';

interface AuthProps {
  onLogin: (user: User) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = () => {
    setIsLoading(true);
    
    // محاكاة عملية الدخول عبر جوجل (تأخير بسيط)
    setTimeout(() => {
      onLogin({
        id: 'google_' + Math.random().toString(36).substr(2, 9),
        username: 'Google User',
        handle: 'google_trader',
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=google_trader`
      });
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col md:flex-row">
      {/* القسم الأيسر: منطقة تسجيل الدخول */}
      <div className="flex-1 p-8 md:p-20 flex flex-col justify-center items-center">
        <div className="max-w-md w-full">
          <div className="flex items-center gap-3 mb-12 justify-center md:justify-start">
            <div className="bg-blue-600 p-3 rounded-2xl shadow-xl shadow-blue-500/20">
              <Activity className="text-white" size={32} />
            </div>
            <h1 className="text-3xl font-black text-white tracking-tighter">TradeFlow</h1>
          </div>

          <div className="mb-12 text-center md:text-left">
            <h2 className="text-4xl font-bold text-white mb-4">Master your edge.</h2>
            <p className="text-slate-400 text-lg">The professional trading journal for high-performance traders. Log, analyze, and excel.</p>
          </div>

          <div className="space-y-6">
            <button
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full bg-white hover:bg-slate-100 text-slate-900 font-bold py-4 px-6 rounded-2xl flex items-center justify-center gap-4 transition-all shadow-xl hover:shadow-white/10 group disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="animate-spin text-slate-900" size={24} />
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
              )}
              <span className="text-lg">Continue with Google</span>
            </button>
            
            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-800"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-slate-950 px-4 text-slate-500 font-bold tracking-widest">Enterprise Secure</span>
              </div>
            </div>
          </div>

          <p className="mt-12 text-slate-600 text-sm text-center md:text-left">
            By continuing, you agree to TradeFlow's <span className="text-slate-400 underline cursor-pointer hover:text-white transition-colors">Terms of Service</span> and <span className="text-slate-400 underline cursor-pointer hover:text-white transition-colors">Privacy Policy</span>.
          </p>
        </div>
      </div>

      {/* القسم الأيمن: ميزات التطبيق */}
      <div className="hidden lg:flex flex-1 bg-slate-900 items-center justify-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-600/5 blur-[120px] rounded-full -translate-x-1/2 translate-y-1/2" />
        
        <div className="grid grid-cols-2 gap-8 p-12 z-10">
          <FeatureCard 
            icon={<ShieldCheck className="text-blue-400" />}
            title="Secure Journaling"
            desc="One-click secure access via Google Auth. Your data remains private."
          />
          <FeatureCard 
            icon={<Globe className="text-emerald-400" />}
            title="Global Feed"
            desc="Connect with other professional traders and share your edge."
          />
          <FeatureCard 
            icon={<Activity className="text-purple-400" />}
            title="AI Insights"
            desc="Powered by Gemini to analyze your performance and mindset."
          />
          <FeatureCard 
            icon={<Trophy className="text-yellow-400" />}
            title="Streak System"
            desc="Gamify your discipline. Build long-term trading habits."
          />
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) => (
  <div className="bg-slate-800/50 backdrop-blur-md p-8 rounded-3xl border border-slate-700/50 hover:border-slate-600 transition-all group">
    <div className="mb-4 transform group-hover:scale-110 transition-transform">{icon}</div>
    <h3 className="text-white font-bold text-xl mb-2">{title}</h3>
    <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
  </div>
);

export default Auth;
