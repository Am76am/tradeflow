
import React, { useState, useEffect } from 'react';
import { Market, TradingSession } from '../types';
import { 
  X, 
  Loader2, 
  Sparkles, 
  Target, 
  DollarSign, 
  Clock, 
  Globe, 
  Tag, 
  ArrowUpCircle, 
  ArrowDownCircle,
  Hash,
  Brain
} from 'lucide-react';
import { getTradingInsight } from '../services/geminiService';

interface LogSessionModalProps {
  onClose: () => void;
  onSave: (session: TradingSession) => void;
  userId: string;
  username: string;
}

const LogSessionModal: React.FC<LogSessionModalProps> = ({ onClose, onSave, userId, username }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    market: Market.FOREX,
    symbol: '',
    tradeSide: 'Long' as 'Long' | 'Short',
    entryPrice: '',
    exitPrice: '',
    lotSize: '1',
    fees: '0.00',
    duration: '30',
    date: new Date().toISOString().slice(0, 16),
    setup: '',
    feelings: '',
    notes: '',
    isPublished: true,
  });

  const [calculations, setCalculations] = useState({ gross: 0, net: 0 });

  useEffect(() => {
    const entry = parseFloat(formData.entryPrice) || 0;
    const exit = parseFloat(formData.exitPrice) || 0;
    const lots = parseFloat(formData.lotSize) || 0;
    const fees = parseFloat(formData.fees) || 0;
    
    let gross = 0;
    if (entry > 0 && exit > 0) {
      if (formData.tradeSide === 'Long') {
        gross = (exit - entry) * lots;
      } else {
        gross = (entry - exit) * lots;
      }
    }
    
    setCalculations({
      gross: Number(gross.toFixed(2)),
      net: Number((gross - fees).toFixed(2))
    });
  }, [formData.entryPrice, formData.exitPrice, formData.lotSize, formData.fees, formData.tradeSide]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const newSession: TradingSession = {
      id: Math.random().toString(36).substr(2, 9),
      userId,
      username,
      market: formData.market,
      pnl: calculations.net,
      duration: parseInt(formData.duration) || 0,
      date: new Date(formData.date).toISOString(),
      notes: formData.notes,
      isPublished: formData.isPublished,
    };

    await getTradingInsight(newSession);
    onSave(newSession);
    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="bg-slate-900 w-full max-w-2xl rounded-[2.5rem] overflow-hidden border border-slate-800 shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col max-h-[95vh] animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-8 border-b border-slate-800/50 bg-slate-900/50">
          <div className="flex items-center gap-4">
            <div className="bg-blue-600/20 p-3 rounded-2xl border border-blue-500/30">
              <Target className="text-blue-400" size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white tracking-tight">Log Session</h2>
              <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em]">Institutional Performance Audit</p>
            </div>
          </div>
          <button onClick={onClose} className="bg-slate-800 hover:bg-rose-500/20 hover:text-rose-400 p-2.5 rounded-full transition-all text-slate-400">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-10 scrollbar-hide">
          
          {/* Dashboard Header */}
          <div className={`p-8 rounded-3xl border transition-all duration-500 ${calculations.net >= 0 ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-rose-500/5 border-rose-500/20'}`}>
             <div className="flex items-center justify-between mb-6">
                <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Real-time P&L Tracker</span>
                <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${calculations.net >= 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                  {calculations.net >= 0 ? 'Surplus' : 'Deficit'}
                </div>
             </div>
             <div className="flex items-end justify-between gap-4">
                <div>
                   <p className={`text-6xl font-black tracking-tighter transition-all ${calculations.net >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                     {calculations.net >= 0 ? '+' : ''}${Math.abs(calculations.net).toLocaleString()}
                   </p>
                   <p className="text-slate-500 text-xs mt-2 font-medium">Projected Net Result</p>
                </div>
                <div className="text-right">
                   <p className="text-slate-500 text-[9px] font-bold uppercase mb-1">Gross P&L</p>
                   <p className="text-white font-bold text-lg">${calculations.gross.toLocaleString()}</p>
                </div>
             </div>
          </div>

          {/* Grid Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Market Column */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-2">
                <Globe size={16} className="text-blue-400" />
                <h3 className="text-white font-black text-[10px] uppercase tracking-widest">Market Selection</h3>
              </div>
              <div className="space-y-4">
                <select
                  className="w-full bg-slate-800/30 border border-slate-700/50 rounded-2xl px-5 py-4 text-white focus:ring-2 focus:ring-blue-500/50 transition-all text-sm appearance-none cursor-pointer"
                  value={formData.market}
                  onChange={e => setFormData({ ...formData, market: e.target.value as Market })}
                >
                  {Object.values(Market).map(m => <option key={m} value={m}>{m}</option>)}
                </select>
                <div className="relative">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500"><Hash size={18} /></div>
                  <input
                    type="text"
                    placeholder="SYMBOL (e.g. BTCUSD)"
                    className="w-full bg-slate-800/30 border border-slate-700/50 rounded-2xl pl-12 pr-5 py-4 text-white placeholder:text-slate-600 focus:ring-2 focus:ring-blue-500/50 transition-all text-sm uppercase font-bold"
                    value={formData.symbol}
                    onChange={e => setFormData({ ...formData, symbol: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Side Selection */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-2">
                <Target size={16} className="text-purple-400" />
                <h3 className="text-white font-black text-[10px] uppercase tracking-widest">Trade Side</h3>
              </div>
              <div className="flex bg-slate-800/30 p-1.5 rounded-2xl border border-slate-700/50 h-[58px]">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, tradeSide: 'Long' })}
                  className={`flex-1 rounded-xl font-black text-[10px] uppercase transition-all flex items-center justify-center gap-2 ${formData.tradeSide === 'Long' ? 'bg-emerald-500 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  <ArrowUpCircle size={16} /> LONG
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, tradeSide: 'Short' })}
                  className={`flex-1 rounded-xl font-black text-[10px] uppercase transition-all flex items-center justify-center gap-2 ${formData.tradeSide === 'Short' ? 'bg-rose-500 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  <ArrowDownCircle size={16} /> SHORT
                </button>
              </div>
            </div>
          </div>

          {/* Pricing Grid */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign size={16} className="text-emerald-400" />
              <h3 className="text-white font-black text-[10px] uppercase tracking-widest">Execution Stats</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <InputGroup label="Entry" value={formData.entryPrice} onChange={v => setFormData({...formData, entryPrice: v})} />
              <InputGroup label="Exit" value={formData.exitPrice} onChange={v => setFormData({...formData, exitPrice: v})} />
              <InputGroup label="Size" value={formData.lotSize} onChange={v => setFormData({...formData, lotSize: v})} />
              <InputGroup label="Fees" value={formData.fees} onChange={v => setFormData({...formData, fees: v})} type="fees" />
            </div>
          </div>

          {/* Psychology */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-2">
              <Brain size={16} className="text-blue-400" />
              <h3 className="text-white font-black text-[10px] uppercase tracking-widest">Psychology & Notes</h3>
            </div>
            <textarea
              className="w-full bg-slate-800/30 border border-slate-700/50 rounded-3xl px-6 py-5 text-white placeholder:text-slate-600 focus:ring-2 focus:ring-blue-500/50 transition-all h-32 resize-none text-sm leading-relaxed"
              placeholder="What was your mental state? Any mistakes or lessons learned?"
              value={formData.notes}
              onChange={e => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>
        </form>

        {/* Footer */}
        <div className="p-8 border-t border-slate-800/50 bg-slate-900/80 backdrop-blur-md">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-5 rounded-2xl flex items-center justify-center gap-4 transition-all disabled:opacity-50 shadow-2xl shadow-blue-600/20 active:scale-[0.98]"
          >
            {loading ? <Loader2 className="animate-spin" size={24} /> : (
              <>
                <Sparkles size={20} className="text-yellow-300" />
                <span className="uppercase tracking-[0.2em] text-xs">Verify Session Data</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

const InputGroup = ({ label, value, onChange, type }: { label: string, value: string, onChange: (v: string) => void, type?: string }) => (
  <div className="space-y-2">
    <label className="text-[9px] font-black text-slate-500 uppercase ml-2 tracking-widest">{label}</label>
    <input
      type="number" step="any"
      className={`w-full bg-slate-800/30 border border-slate-700/50 rounded-2xl px-4 py-4 text-white focus:ring-2 transition-all text-sm font-bold ${type === 'fees' ? 'focus:ring-rose-500/50' : 'focus:ring-blue-500/50'}`}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder="0.00"
    />
  </div>
);

export default LogSessionModal;
