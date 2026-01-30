
import React, { useRef, useState } from 'react';
import { TradingSession, User } from '../types';
import { format } from 'date-fns';
import { Share2, Download, Loader2, CheckCircle2, Copy, Link as LinkIcon } from 'lucide-react';
import Sparkline from './Sparkline';

interface ShareCardProps {
  session: TradingSession;
  user: User;
  streak: number;
}

const ShareCard: React.FC<ShareCardProps> = ({ session, user, streak }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const isProfit = session.pnl >= 0;

  const generateImageFile = async (): Promise<File | null> => {
    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1350; // Instagram Portrait Ratio
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // Background
    const bgGradient = ctx.createLinearGradient(0, 0, 0, 1350);
    bgGradient.addColorStop(0, '#020617');
    bgGradient.addColorStop(1, '#0f172a');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, 1080, 1350);

    // Decorative Glow
    const radialGradient = ctx.createRadialGradient(540, 675, 100, 540, 675, 800);
    radialGradient.addColorStop(0, isProfit ? 'rgba(16, 185, 129, 0.1)' : 'rgba(244, 63, 94, 0.1)');
    radialGradient.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = radialGradient;
    ctx.fillRect(0, 0, 1080, 1350);

    // Branding
    ctx.fillStyle = '#3b82f6';
    ctx.font = '900 70px Inter, sans-serif';
    ctx.fillText('TRADEFLOW', 80, 130);
    
    ctx.fillStyle = '#64748b';
    ctx.font = 'bold 30px Inter, sans-serif';
    ctx.fillText('SESSION PERFORMANCE AUDIT', 80, 185);

    // Market Badge
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 120px Inter, sans-serif';
    ctx.fillText(session.market.toUpperCase(), 80, 420);

    // Main Result
    ctx.fillStyle = isProfit ? '#10b981' : '#f43f5e';
    ctx.font = '900 220px Inter, sans-serif';
    const pnlValue = `${isProfit ? '+' : '-'}$${Math.abs(session.pnl).toLocaleString()}`;
    ctx.fillText(pnlValue, 80, 650);

    // Stats Grid Helper
    const drawStat = (label: string, value: string, x: number, y: number) => {
      ctx.fillStyle = 'rgba(30, 41, 59, 0.4)';
      ctx.beginPath();
      ctx.roundRect(x, y, 420, 180, 40);
      ctx.fill();
      
      ctx.fillStyle = '#94a3b8';
      ctx.font = 'bold 28px Inter, sans-serif';
      ctx.fillText(label, x + 40, y + 65);

      ctx.fillStyle = '#ffffff';
      ctx.font = '900 55px Inter, sans-serif';
      ctx.fillText(value, x + 40, y + 130);
    };

    drawStat('DURATION', `${session.duration} MINS`, 80, 800);
    drawStat('STREAK', `${streak} DAYS 🔥`, 580, 800);

    // Footer
    ctx.fillStyle = 'rgba(255,255,255,0.03)';
    ctx.fillRect(0, 1150, 1080, 200);
    
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 45px Inter, sans-serif';
    ctx.fillText(`@${user.handle}`, 80, 1245);
    
    ctx.fillStyle = '#475569';
    ctx.font = '32px Inter, sans-serif';
    ctx.fillText(`Verified Performance • ${format(new Date(session.date), 'MMMM dd, yyyy')}`, 80, 1295);

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(new File([blob], `tradeflow-${session.id}.png`, { type: 'image/png' }));
        } else {
          resolve(null);
        }
      }, 'image/png', 1.0);
    });
  };

  const handleShare = async () => {
    setIsGenerating(true);
    try {
      const imageFile = await generateImageFile();
      if (!imageFile) throw new Error("Image gen failed");

      // Fix for "Invalid URL" error: Check if the URL is absolute and valid
      let currentUrl = window.location.href;
      // If we are in a sandbox or local environment without proper protocol, don't send the URL
      const shareUrl = currentUrl.startsWith('http') ? currentUrl : undefined;

      const shareData: ShareData = {
        title: `TradeFlow Session - ${session.market}`,
        text: `Check out my ${session.market} session! Result: ${isProfit ? '+' : ''}$${session.pnl}. #Trading #TradeFlow`,
        files: [imageFile],
        ...(shareUrl && { url: shareUrl })
      };

      if (navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        // Download fallback for desktop
        const url = URL.createObjectURL(imageFile);
        const a = document.createElement('a');
        a.href = url;
        a.download = `trade-result-${session.id}.png`;
        a.click();
        URL.revokeObjectURL(url);
        alert("Image downloaded! You can now share it to social media.");
      }
    } catch (err) {
      console.error("Share failed", err);
      alert("Sharing failed. You can take a screenshot to share manually!");
    } finally {
      setIsGenerating(false);
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="w-full max-w-sm aspect-[4/5] bg-slate-900 border-2 border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl relative flex flex-col p-8 group">
        <div className={`absolute top-0 right-0 w-64 h-64 blur-[100px] opacity-20 rounded-full ${isProfit ? 'bg-emerald-500' : 'bg-rose-500'}`} />
        
        <div className="flex justify-between items-start mb-8 z-10">
          <div>
            <h2 className="text-slate-500 font-bold uppercase tracking-widest text-[9px]">Trading Audit</h2>
            <p className="text-white text-xl font-black tracking-tight">{session.market}</p>
          </div>
          <div className="bg-slate-800/80 px-3 py-1 rounded-full border border-slate-700/50">
            <span className="text-[10px] text-slate-300 font-bold">{format(new Date(session.date), 'MMM dd')}</span>
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-center items-center z-10">
          <div className="w-full mb-6">
             <div className="h-32 w-full bg-slate-950/50 rounded-2xl overflow-hidden">
               <Sparkline
                 pnl={session.pnl}
                 seed={session.id}
                 positive={isProfit}
                 width={320}
                 height={128}
                 strokeWidth={4}
                 showArea={true}
                 showDot={true}
               />
             </div>
          </div>
          <p className="text-slate-500 font-bold text-[10px] uppercase tracking-widest mb-1">Session Outcome</p>
          <h3 className={`text-6xl font-black tracking-tighter ${isProfit ? 'text-emerald-400' : 'text-rose-400'}`}>
            {isProfit ? '+' : ''}${Math.abs(session.pnl).toLocaleString()}
          </h3>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-auto z-10">
          <div className="bg-slate-800/40 p-4 rounded-2xl border border-slate-700/30 backdrop-blur-sm">
            <p className="text-slate-500 text-[8px] font-bold uppercase mb-1">Duration</p>
            <p className="text-white font-bold text-xs">{session.duration} min</p>
          </div>
          <div className="bg-slate-800/40 p-4 rounded-2xl border border-slate-700/30 backdrop-blur-sm">
            <p className="text-slate-500 text-[8px] font-bold uppercase mb-1">Streak</p>
            <p className="text-white font-bold text-xs">{streak} Days 🔥</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 w-full max-w-sm">
        <button 
          onClick={handleShare}
          disabled={isGenerating}
          className="w-full bg-blue-600 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-3 hover:bg-blue-500 transition-all active:scale-[0.98] disabled:opacity-70 shadow-xl shadow-blue-600/20"
        >
          {isGenerating ? <Loader2 className="animate-spin" size={20} /> : <Share2 size={20} />}
          <span className="uppercase tracking-widest text-sm">Post to Instagram</span>
        </button>

        <button 
          onClick={copyLink}
          className="w-full bg-slate-900 text-slate-300 font-bold py-3 rounded-2xl flex items-center justify-center gap-3 hover:bg-slate-800 border border-slate-800 transition-all"
        >
          {copied ? <CheckCircle2 size={18} className="text-emerald-400" /> : <LinkIcon size={18} />}
          <span className="text-xs uppercase tracking-widest">{copied ? 'Link Copied!' : 'Copy Share Link'}</span>
        </button>
      </div>
    </div>
  );
};

export default ShareCard;
