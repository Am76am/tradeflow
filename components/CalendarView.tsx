
import React, { useState } from 'react';
import { 
  format, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameDay, 
  addMonths
} from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { TradingSession } from '../types';

interface CalendarViewProps {
  sessions: TradingSession[];
  onDayClick: (sessions: TradingSession[]) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({ sessions, onDayClick }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getDaySessions = (day: Date) => {
    return sessions.filter(s => isSameDay(new Date(s.date), day));
  };

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(addMonths(currentMonth, -1));

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl max-w-sm mx-auto md:mx-0">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-bold text-white">{format(currentMonth, 'MMMM yyyy')}</h2>
        </div>
        <div className="flex gap-1">
          <button onClick={prevMonth} className="p-1 hover:bg-slate-800 rounded-full transition-colors text-slate-400">
            <ChevronLeft size={18} />
          </button>
          <button onClick={nextMonth} className="p-1 hover:bg-slate-800 rounded-full transition-colors text-slate-400">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center mb-2">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, idx) => (
          <div key={`${day}-${idx}`} className="text-slate-600 text-[10px] font-bold uppercase tracking-tighter">{day}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {/* Empty cells for padding */}
        {Array.from({ length: monthStart.getDay() }).map((_, i) => (
          <div key={`empty-${i}`} className="aspect-square" />
        ))}

        {days.map(day => {
          const daySessions = getDaySessions(day);
          const hasSessions = daySessions.length > 0;
          const totalPnl = daySessions.reduce((acc, s) => acc + s.pnl, 0);
          const isProfit = totalPnl > 0;
          const isLoss = totalPnl < 0;

          return (
            <button
              key={day.toISOString()}
              onClick={() => onDayClick(daySessions)}
              className={`
                aspect-square rounded-lg flex flex-col items-center justify-center relative transition-all
                ${hasSessions ? 'ring-1 ring-slate-700' : 'hover:bg-slate-800/50'}
                ${isProfit ? 'bg-emerald-500/10 text-emerald-400 ring-emerald-500/30' : ''}
                ${isLoss ? 'bg-rose-500/10 text-rose-400 ring-rose-500/30' : ''}
                ${hasSessions && totalPnl === 0 ? 'bg-slate-700/50 text-white font-bold' : ''}
                ${!hasSessions ? 'text-slate-600' : 'font-bold'}
              `}
            >
              <span className="text-[10px]">{format(day, 'd')}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-800 text-[9px] text-slate-500 font-bold uppercase tracking-tighter">
        <div className="flex items-center gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span>Win</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />
          <span>Loss</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-slate-600" />
          <span>Neutral</span>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
