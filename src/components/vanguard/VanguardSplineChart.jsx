import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';

export function VanguardSplineChart({ services, selectedService }) {
  // Préparation d'une courbe continue fluide sur 24 points d'intervalle
  const dataPoints = 24;
  const chartData = [];

  const baseLatency = selectedService ? (selectedService.responseTime || 110) : 120;

  for (let i = 1; i <= dataPoints; i++) {
    // Calcul d'une oscillation naturelle rappelant la courbe Vanguard
    // Une vague qui descend vers le milieu (point 12) puis remonte
    const wave = Math.sin((i / dataPoints) * Math.PI * 2) * 45;
    const drop = i === 12 ? -35 : (i > 10 && i < 14 ? -20 : 0);
    const noise = ((i * 17) % 15) - 7;
    const value = Math.max(30, Math.round(baseLatency + wave + drop + noise));

    chartData.push({
      step: i,
      label: `${i}h`,
      latency: value
    });
  }

  // Trouver le point le plus bas (le "drop at 12h")
  const dropPoint = chartData[11];

  return (
    <div className="bg-[#161224] border border-[#251f38] rounded-2xl p-5 shadow-xl flex flex-col justify-between">
      
      {/* En-tête style Vanguard */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#9d92b5]">
          (a) AVERAGE RESPONSE TIME TREND (HOURLY IN 2026)
        </h3>
        <span className="text-[11px] font-mono text-[#716885]">
          Latency (ms)
        </span>
      </div>

      {/* Graphique Spline Ondulée avec Callout Ancré */}
      <div className="relative h-48 sm:h-56 w-full">
        
        {/* Callout flottant sur la courbe à l'index 12 comme dans la capture */}
        <div 
          className="absolute z-20 pointer-events-none hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#100d1a] border border-[#482836] text-[10px] font-mono text-[#f97356] shadow-lg"
          style={{ top: '65%', left: '46%' }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#f97356] animate-ping" />
          <span>Optimal dip at 12h</span>
        </div>

        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
            <defs>
              <linearGradient id="vanguardSplineGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f97356" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#f97356" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#251f38" opacity={0.4} />
            <XAxis
              dataKey="step"
              stroke="#6b6280"
              fontSize={10}
              tickLine={false}
              fontFamily="monospace"
              ticks={[4, 8, 12, 16, 20, 24]}
            />
            <YAxis
              stroke="#6b6280"
              fontSize={10}
              tickLine={false}
              fontFamily="monospace"
              unit="ms"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#110e1b',
                borderColor: '#392d4f',
                borderRadius: '0.5rem',
                fontSize: '11px',
                color: '#fff',
                fontFamily: 'monospace'
              }}
              formatter={(val) => [`${val} ms`, 'Response Time']}
              labelFormatter={(label) => `Hour ${label}:00`}
            />
            <Area
              type="monotone"
              dataKey="latency"
              stroke="#f97356"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#vanguardSplineGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Footer sous la courbe style Vanguard */}
      <div className="flex items-center justify-between text-xs font-mono pt-3 border-t border-[#231d34] mt-3">
        <div className="flex items-baseline gap-2">
          <span className="text-sm font-bold text-white font-mono">{baseLatency} ms</span>
          <span className="text-[11px] text-[#7a718f]">avg response time</span>
        </div>

        <div className="text-[11px] text-[#34d399] font-medium flex items-center gap-1.5">
          <span>✔ vs 800ms Regional Benchmark</span>
        </div>
      </div>

    </div>
  );
}
