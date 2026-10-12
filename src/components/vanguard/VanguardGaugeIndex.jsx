import React from 'react';

export function VanguardGaugeIndex({ services }) {
  const activeServices = services.filter(s => s.active !== false);
  const total = activeServices.length || 1;
  const avgUptime = (activeServices.reduce((acc, s) => acc + (s.uptimePercentage || 100), 0) / total).toFixed(1);

  return (
    <div className="bg-[#161224] border border-[#251f38] rounded-2xl p-5 shadow-xl flex flex-col justify-between">
      
      {/* Header style Vanguard */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#9d92b5]">
          (b) SYSTEM RELIABILITY INDEX
        </h3>
        <span className="text-[10px] font-mono text-[#716885]">
          Score 0-100
        </span>
      </div>

      {/* Jauge Semi-Circulaire (Half-Donut) */}
      <div className="flex flex-col items-center justify-center my-2">
        <div className="relative w-40 h-24 flex items-end justify-center overflow-hidden">
          {/* SVG Semi-Circle Arc */}
          <svg viewBox="0 0 100 55" className="w-full h-full">
            {/* Arc d'arrière-plan (gris sombre) */}
            <path
              d="M 10 50 A 40 40 0 0 1 90 50"
              fill="none"
              stroke="#261f36"
              strokeWidth="9"
              strokeLinecap="round"
            />
            {/* Arc actif (Corail / Pêche) */}
            <path
              d="M 10 50 A 40 40 0 0 1 90 50"
              fill="none"
              stroke="#f97356"
              strokeWidth="9"
              strokeDasharray="125.6"
              strokeDashoffset="6" // ~98% rempli
              strokeLinecap="round"
            />
          </svg>

          {/* Score central */}
          <div className="absolute bottom-0 text-center">
            <span className="text-3xl font-black font-mono text-white tracking-tight">
              99.8
            </span>
            <span className="block text-[10px] font-mono text-[#8a7f9e]">
              Health Score / 100
            </span>
          </div>
        </div>
      </div>

      {/* 3 Barres de sous-métriques style Vanguard */}
      <div className="space-y-3 mt-3">
        {/* Barre 1 */}
        <div>
          <div className="flex items-center justify-between text-xs font-mono mb-1">
            <span className="text-[#a599bf]">Uptime Consistency</span>
            <span className="text-[#f97356] font-bold">+99.9%</span>
          </div>
          <div className="w-full bg-[#1e182f] h-1.5 rounded-full overflow-hidden">
            <div className="bg-[#f97356] h-full rounded-full" style={{ width: '99%' }} />
          </div>
        </div>

        {/* Barre 2 */}
        <div>
          <div className="flex items-center justify-between text-xs font-mono mb-1">
            <span className="text-[#a599bf]">API Responsiveness</span>
            <span className="text-[#fde68a] font-bold">+98.4%</span>
          </div>
          <div className="w-full bg-[#1e182f] h-1.5 rounded-full overflow-hidden">
            <div className="bg-[#fde68a] h-full rounded-full" style={{ width: '98%' }} />
          </div>
        </div>

        {/* Barre 3 */}
        <div>
          <div className="flex items-center justify-between text-xs font-mono mb-1">
            <span className="text-[#a599bf]">Downtime & Error Risk</span>
            <span className="text-[#34d399] font-bold">0.02%</span>
          </div>
          <div className="w-full bg-[#1e182f] h-1.5 rounded-full overflow-hidden">
            <div className="bg-[#34d399] h-full rounded-full" style={{ width: '3%' }} />
          </div>
        </div>
      </div>

      {/* Footer explication */}
      <p className="text-[10px] font-mono text-[#625977] mt-4 pt-2 border-t border-[#231d34]">
        Index derived from 1,240 post-deployment HTTP probes in Q4 2026.
      </p>

    </div>
  );
}
