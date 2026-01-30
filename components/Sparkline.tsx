import React from 'react';

interface SparklineProps {
  pnl: number;
  seed: string;
  positive: boolean;
  width?: number;
  height?: number;
  strokeWidth?: number;
  showArea?: boolean;
  showDot?: boolean;
  colors?: { stroke: string; areaFrom: string; areaTo: string };
}

const Sparkline: React.FC<SparklineProps> = ({
  pnl,
  seed,
  positive,
  width = 300,
  height = 160,
  strokeWidth = 3,
  showArea = true,
  showDot = true,
  colors,
}) => {
  // deterministic hash from seed
  const hash = String(
    seed
      .split('')
      .reduce((s, c) => s + c.charCodeAt(0), 0)
  );

  // generate values that rise toward the end and include jitter
  const pointsCount = 38;
  const values: number[] = [];
  for (let i = 0; i < pointsCount; i++) {
    const t = i / (pointsCount - 1);
    const base = pnl * (0.1 + 0.9 * t); // trend towards the end
    const jitter = Math.sin(i + Number(hash)) * (Math.abs(pnl) * 0.06);
    values.push(base + jitter);
  }

  // map to coordinates
  const min = Math.min(...values, 0);
  const max = Math.max(...values, 1);
  const padX = 4;
  const padY = 6;
  const w = width;
  const h = height;
  const scaleX = (i: number) => padX + (i / (pointsCount - 1)) * (w - padX * 2);
  const scaleY = (v: number) => padY + (1 - (v - min) / (max - min)) * (h - padY * 2);

  const pts = values.map((v, i) => ({ x: scaleX(i), y: scaleY(v) }));

  // quadratic smoothing using midpoint method
  let d = '';
  if (pts.length > 0) {
    d += `M ${pts[0].x.toFixed(2)} ${pts[0].y.toFixed(2)}`;
    for (let i = 1; i < pts.length; i++) {
      const prev = pts[i - 1];
      const cur = pts[i];
      const cx = ((prev.x + cur.x) / 2).toFixed(2);
      const cy = ((prev.y + cur.y) / 2).toFixed(2);
      d += ` Q ${prev.x.toFixed(2)} ${prev.y.toFixed(2)} ${cx} ${cy}`;
    }
    const last = pts[pts.length - 1];
    d += ` T ${last.x.toFixed(2)} ${last.y.toFixed(2)}`;
  }

  const areaPath = `${d} L ${w} ${h} L 0 ${h} Z`;

  const stroke = colors?.stroke ?? (positive ? '#10b981' : '#f43f5e');
  const areaFrom = colors?.areaFrom ?? (positive ? 'rgba(16,185,129,0.18)' : 'rgba(244,63,94,0.12)');
  const areaTo = colors?.areaTo ?? 'rgba(0,0,0,0)';
  const gid = `g-${hash}-${width}-${height}`;

  const lastPoint = pts[pts.length - 1];

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-full">
      <defs>
        <linearGradient id={gid} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={areaFrom} />
          <stop offset="100%" stopColor={areaTo} />
        </linearGradient>
        <filter id={`f-${gid}`} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="6" stdDeviation="10" floodColor={stroke} floodOpacity="0.12" />
        </filter>
      </defs>

      {showArea && <path d={areaPath} fill={`url(#${gid})`} filter={`url(#f-${gid})`} />}

      <path d={d} fill="none" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />

      {showDot && lastPoint && (
        <g>
          <circle cx={lastPoint.x} cy={lastPoint.y} r={8} fill={stroke} />
          <circle cx={lastPoint.x} cy={lastPoint.y} r={4} fill="#0f172a" />
        </g>
      )}
    </svg>
  );
};

export default Sparkline;
