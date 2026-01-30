
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Activity, 
  Calendar as CalendarIcon, 
  Users, 
  Plus, 
  TrendingUp, 
  Flame, 
  LogOut,
  User as UserIcon,
  Search,
  MessageSquare,
  X
} from 'lucide-react';
import { TradingSession, User, Market } from './types';
import { calculateStreaks } from './utils/streakLogic';
import Auth from './components/Auth';
import CalendarView from './components/CalendarView';
import LogSessionModal from './components/LogSessionModal';
import ShareCard from './components/ShareCard';
import Sparkline from './components/Sparkline';
import { format } from 'date-fns';

const INITIAL_SESSIONS: TradingSession[] = [
  {
    id: 's1',
    userId: 'u1',
    username: 'AlphaTrader',
    market: Market.CRYPTO,
    pnl: 1250,
    duration: 45,
    date: new Date(Date.now() - 86400000 * 2).toISOString(),
    isPublished: true,
    
  },
  {
    id: 's2',
    userId: 'u1',
    username: 'AlphaTrader',
    market: Market.FOREX,
    pnl: -400,
    duration: 120,
    date: new Date(Date.now() - 86400000).toISOString(),
    isPublished: true,
   
  }
];

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [sessions, setSessions] = useState<TradingSession[]>([]);
  const [activeTab, setActiveTab] = useState<'feed' | 'stats' | 'profile'>('feed');
  const [showLogModal, setShowLogModal] = useState(false);
  const [selectedDaySessions, setSelectedDaySessions] = useState<TradingSession[]>([]);
  const [sharingSession, setSharingSession] = useState<TradingSession | null>(null);

  // Persistence
  useEffect(() => {
    const savedUser = localStorage.getItem('tradeflow_user');
    const savedSessions = localStorage.getItem('tradeflow_sessions');
    
    if (savedUser) setCurrentUser(JSON.parse(savedUser));
    if (savedSessions) {
      setSessions(JSON.parse(savedSessions));
    } else {
      setSessions(INITIAL_SESSIONS);
    }
  }, []);

  useEffect(() => {
    if (sessions.length > 0) {
      localStorage.setItem('tradeflow_sessions', JSON.stringify(sessions));
    }
  }, [sessions]);

  const streakStats = useMemo(() => calculateStreaks(sessions), [sessions]);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('tradeflow_user', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('tradeflow_user');
  };

  const handleSaveSession = (session: TradingSession) => {
    setSessions(prev => [session, ...prev]);
    // Open the share/preview card immediately after saving
    setSharingSession(session);
  };

  if (!currentUser) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 pb-24 md:pb-0 md:pl-64">
      {/* Sidebar Navigation */}
      <nav className="hidden md:flex fixed left-0 top-0 bottom-0 w-64 bg-slate-900 border-r border-slate-800 flex-col p-6">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="bg-blue-600 p-2 rounded-xl">
            <Activity className="text-white" />
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">TradeFlow</h1>
        </div>

        <div className="space-y-2">
          <NavItem 
            active={activeTab === 'feed'} 
            icon={<Users size={20} />} 
            label="Feed & Journal" 
            onClick={() => setActiveTab('feed')} 
          />
          <NavItem 
            active={activeTab === 'stats'} 
            icon={<CalendarIcon size={20} />} 
            label="Full History" 
            onClick={() => setActiveTab('stats')} 
          />
          <NavItem 
            active={activeTab === 'profile'} 
            icon={<UserIcon size={20} />} 
            label="Profile" 
            onClick={() => setActiveTab('profile')} 
          />
        </div>

        <div className="mt-auto space-y-4">
          <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase">Streak</span>
              <Flame size={16} className="text-orange-500" />
            </div>
            <p className="text-white font-bold text-2xl">{streakStats.currentStreak} Days</p>
            <p className="text-slate-400 text-xs mt-1">Best: {streakStats.bestStreak} days</p>
          </div>

          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </nav>

      {/* Mobile Header */}
      <header className="md:hidden flex items-center justify-between p-4 bg-slate-900 border-b border-slate-800 sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-1.5 rounded-lg">
            <Activity size={20} className="text-white" />
          </div>
          <h1 className="text-lg font-bold text-white">TradeFlow</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 text-orange-500 font-bold">
            <Flame size={20} />
            <span>{streakStats.currentStreak}</span>
          </div>
          <button onClick={() => setActiveTab('profile')}>
            <img src={currentUser.avatar} className="w-8 h-8 rounded-full bg-slate-700" alt="avatar" />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-4xl mx-auto p-4 md:p-10 space-y-8">
        {activeTab === 'feed' && (
          <div className="space-y-8">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
              <div className="flex-1">
                <h2 className="text-3xl font-black text-white mb-2">Morning, Trader</h2>
                <p className="text-slate-400 mb-6">Here is your performance snapshot.</p>
                <div className="flex gap-4">
                   <button 
                    onClick={() => setShowLogModal(true)}
                    className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-blue-500/20 active:scale-95"
                  >
                    <Plus size={20} />
                    <span>Log New Session</span>
                  </button>
                </div>
              </div>
              
              {/* Calendar in a compact sidebar-like feel in desktop, or centered in mobile */}
              <div className="shrink-0">
                <CalendarView 
                  sessions={sessions} 
                  onDayClick={(daySessions) => setSelectedDaySessions(daySessions)} 
                />
              </div>
            </div>

            {selectedDaySessions.length > 0 ? (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 pt-4 border-t border-slate-900">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white">
                    Sessions for {format(new Date(selectedDaySessions[0].date), 'MMMM dd, yyyy')}
                  </h3>
                  <button onClick={() => setSelectedDaySessions([])} className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors">
                    <X size={14} /> Clear
                  </button>
                </div>
                <div className="space-y-4">
                  {selectedDaySessions.map(session => (
                    <FeedCard key={session.id} session={session} isMe={session.userId === currentUser.id} onShare={() => setSharingSession(session)} />
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center gap-2 pt-4">
                   <Users className="text-blue-500" size={18} />
                   <h2 className="text-lg font-bold text-white">Community Feed</h2>
                </div>
                <div className="space-y-6">
                  {sessions.filter(s => s.isPublished).length > 0 ? (
                    sessions.filter(s => s.isPublished).map(session => (
                      <FeedCard 
                        key={session.id} 
                        session={session} 
                        isMe={session.userId === currentUser.id}
                        onShare={() => setSharingSession(session)}
                      />
                    ))
                  ) : (
                    <div className="text-center py-20 bg-slate-900/50 rounded-3xl border border-dashed border-slate-800">
                      <p className="text-slate-500">The community feed is quiet. Be the first to publish!</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">Session History</h2>
                <p className="text-slate-400">Full audit of all your trading logs</p>
              </div>
              <div className="text-right">
                <p className="text-slate-500 text-xs font-bold uppercase mb-1">Total P&L</p>
                <p className={`text-xl font-bold ${sessions.reduce((a, b) => a + b.pnl, 0) >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  ${sessions.reduce((a, b) => a + b.pnl, 0).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {sessions.length > 0 ? (
                sessions.map(session => (
                  <FeedCard 
                    key={session.id} 
                     session={session} 
                    isMe={session.userId === currentUser.id}
                    onShare={() => setSharingSession(session)}
                  />
                ))
              ) : (
                <p className="text-slate-500 text-center py-12">You haven't logged any sessions yet.</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="space-y-8">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 flex flex-col items-center text-center">
              <div className="relative mb-4">
                <img src={currentUser.avatar} className="w-24 h-24 rounded-full bg-slate-800 border-4 border-slate-800" alt="avatar" />
                <div className="absolute -bottom-1 -right-1 bg-blue-600 p-1.5 rounded-full border-2 border-slate-900">
                  <Flame size={16} className="text-white" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-white">{currentUser.username}</h2>
              <p className="text-slate-400 mb-6">@{currentUser.handle}</p>

              <div className="grid grid-cols-3 gap-8 w-full border-t border-slate-800 pt-8">
                <div>
                  <p className="text-slate-500 text-xs font-bold uppercase mb-1">Sessions</p>
                  <p className="text-white text-xl font-bold">{sessions.length}</p>
                </div>
                <div>
                  <p className="text-slate-500 text-xs font-bold uppercase mb-1">Win Rate</p>
                  <p className="text-white text-xl font-bold">
                    {sessions.length > 0 
                      ? `${Math.round((sessions.filter(s => s.pnl > 0).length / sessions.length) * 100)}%` 
                      : '0%'}
                  </p>
                </div>
                <div>
                  <p className="text-slate-500 text-xs font-bold uppercase mb-1">Avg Profit</p>
                  <p className="text-white text-xl font-bold">
                    ${sessions.length > 0 
                      ? Math.round(sessions.reduce((a, b) => a + b.pnl, 0) / sessions.length) 
                      : 0}
                  </p>
                </div>
              </div>
            </div>

            <button 
              onClick={handleLogout}
              className="md:hidden w-full bg-slate-900 hover:bg-rose-500/10 hover:text-rose-400 text-slate-400 font-bold py-4 rounded-2xl border border-slate-800 transition-all"
            >
              Logout Account
            </button>
          </div>
        )}
      </main>

      {/* Mobile Nav Bar */}
      <footer className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 flex justify-around p-3 z-40 backdrop-blur-lg bg-opacity-80">
        <MobileNavItem 
          active={activeTab === 'feed'} 
          icon={<Users size={24} />} 
          label="Feed" 
          onClick={() => setActiveTab('feed')} 
        />
        <MobileNavItem 
          active={activeTab === 'stats'} 
          icon={<CalendarIcon size={24} />} 
          label="History" 
          onClick={() => setActiveTab('stats')} 
        />
        <div className="relative -top-6">
          <button 
            onClick={() => setShowLogModal(true)}
            className="bg-blue-600 p-4 rounded-full text-white shadow-xl shadow-blue-500/30 active:scale-95 transition-transform"
          >
            <Plus size={24} />
          </button>
        </div>
        <MobileNavItem 
          active={activeTab === 'profile'} 
          icon={<UserIcon size={24} />} 
          label="Profile" 
          onClick={() => setActiveTab('profile')} 
        />
        <div className="flex flex-col items-center gap-1 opacity-50 cursor-not-allowed">
           <Search size={24} className="text-slate-400" />
           <span className="text-[10px] font-bold text-slate-400 uppercase">Search</span>
        </div>
      </footer>

      {/* Modals */}
      {showLogModal && (
        <LogSessionModal 
          onClose={() => setShowLogModal(false)} 
          onSave={handleSaveSession}
          userId={currentUser.id}
          username={currentUser.username}
        />
      )}

      {sharingSession && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
          <div className="w-full max-w-sm">
            <div className="flex justify-end mb-4">
               <button onClick={() => setSharingSession(null)} className="text-white hover:bg-slate-800 p-2 rounded-full">
                  <X />
               </button>
            </div>
            <ShareCard 
              session={sharingSession} 
              user={currentUser} 
              streak={streakStats.currentStreak} 
            />
          </div>
        </div>
      )}
    </div>
  );
};

const NavItem = ({ active, icon, label, onClick }: { active: boolean, icon: React.ReactNode, label: string, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${active ? 'bg-blue-600/10 text-blue-400' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
  >
    {icon}
    <span>{label}</span>
  </button>
);

const MobileNavItem = ({ active, icon, label, onClick }: { active: boolean, icon: React.ReactNode, label: string, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center gap-1 transition-all ${active ? 'text-blue-500' : 'text-slate-500'}`}
  >
    {icon}
    <span className="text-[10px] font-bold uppercase tracking-wider">{label}</span>
  </button>
);

interface FeedCardProps {
  session: TradingSession;
  isMe: boolean;
  onShare: () => void;
}

const FeedCard: React.FC<FeedCardProps> = ({ session, isMe, onShare }) => {
  const isProfit = session.pnl >= 0;
  
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 transition-colors">
      <div className="p-5 flex items-start gap-4">
        <div className="shrink-0">
          <img src={`https://picsum.photos/seed/${session.username}/100`} className="w-12 h-12 rounded-full bg-slate-800" alt="avatar" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <p className="text-white font-bold truncate">@{session.username}</p>
            <span className="text-slate-500 text-xs">{format(new Date(session.date), 'h:mm a')}</span>
          </div>
          <p className="text-slate-400 text-sm mb-4">Just finished a <span className="text-white font-semibold">{session.market}</span> session lasting <span className="text-white font-semibold">{session.duration} min</span>.</p>
          
          <div className={`mb-4 p-3 rounded-xl w-full ${isProfit ? 'bg-emerald-500/5 ring-1 ring-emerald-500/20' : 'bg-rose-500/5 ring-1 ring-rose-500/20'}`}>
            <div className="w-full flex justify-center mb-3">
              <div className="w-full max-w-[680px] h-28 rounded-lg overflow-hidden">
                <Sparkline pnl={session.pnl} seed={session.id} positive={isProfit} width={680} height={112} strokeWidth={3} showArea={true} showDot={false} />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className={`p-2 rounded-lg ${isProfit ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                <TrendingUp size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-slate-500 text-xs font-bold uppercase tracking-wide">P&L Status</p>
                <p className={`text-xl font-black ${isProfit ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {isProfit ? '+' : ''}${session.pnl.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

         

          {session.notes && (
            <p className="text-slate-400 text-sm bg-slate-950/50 p-3 rounded-lg border-l-2 border-slate-700 mb-4">{session.notes}</p>
          )}

          <div className="flex items-center gap-6 text-slate-500">
            <button className="flex items-center gap-2 hover:text-white transition-colors">
              <TrendingUp size={18} />
              <span className="text-xs font-bold">Strategy</span>
            </button>
            <button className="flex items-center gap-2 hover:text-white transition-colors">
              <MessageSquare size={18} />
              <span className="text-xs font-bold">Comment</span>
            </button>
            {isMe && (
              <button 
                onClick={onShare}
                className="ml-auto bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all"
              >
                Share
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};


export default App;
