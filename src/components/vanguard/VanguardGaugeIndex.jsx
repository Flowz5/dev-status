import React from 'react';

export function VanguardGaugeIndex({ services }) {
  const activeServices = services.filter(s => s.active !== false);
  const total = activeServices.length || 1;
  const avgUptime = (activeServices.reduce((acc, s) => acc + (s.uptimePercentage || 100), 0) / total).toFixed(1);

  return (
    <div className="bg-[#161224] border border-[#251f38] rounded-2xl p-5 shadow-xl flex flex-col justify-between">
      
      {/* Header en Français */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#9d92b5]">
          INDICE DE SANTÉ GLOBAL
        </h3>
        <span className="text-[10px] font-mono text-[#716885]">
          Score 0-100
        </span>
      </div>

      {/* Jauge Semi-Circulaire avec texte parfaitement positionné sans chevauchement */}
      <div className="flex flex-col items-center justify-center my-2">
        <div className="relative w-44 h-28 flex items-center justify-center">
          {/* SVG Semi-Circle Arc */}
          <svg viewBox="0 0 100 58" className="w-full h-full">
            {/* Arc d'arrière-plan */}
            <path
              d="M 12 52 A 38 38 0 0 1 88 52"
              fill="none"
              stroke="#251e36"
              strokeWidth="9"
              strokeLinecap="round"
            />
            {/* Arc actif Corail */}
            <path
              d="M 12 52 A 38 38 0 0 1 88 52"
              fill="none"
              stroke="#f97356"
              strokeWidth="9"
              strokeDasharray="119.4"
              strokeDashoffset="2"
              strokeLinecap="round"
            />
          </svg>

          {/* Score central et étiquette nettement séparés */}
          <div className="absolute top-10 flex flex-col items-center justify-center text-center">
            <span className="text-3xl font-black font-mono text-white tracking-tight leading-none">
              {avgUptime}
            </span>
            <span className="text-[10px] font-mono text-[#9e94b5] uppercase tracking-wider mt-1.5 font-semibold">
              Score de santé / 100
            </span>
          </div>
        </div>
      </div>

      {/* 3 Barres de sous-métriques en Français */}
      <div className="space-y-3 mt-2">
        {/* Barre 1 */}
        <div>
          <div className="flex items-center justify-between text-xs font-mono mb-1">
            <span className="text-[#a599bf]">Disponibilité (Uptime)</span>
            <span className="text-[#f97356] font-bold">+{avgUptime}%</span>
          </div>
          <div className="w-full bg-[#1e182f] h-1.5 rounded-full overflow-hidden">
            <div className="bg-[#f97356] h-full rounded-full" style={{ width: `${avgUptime}%` }} />
          </div>
        </div>

        {/* Barre 2 */}
        <div>
          <div className="flex items-center justify-between text-xs font-mono mb-1">
            <span className="text-[#a599bf]">Rapidité des requêtes</span>
            <span className="text-[#fde68a] font-bold">+98.5%</span>
          </div>
          <div className="w-full bg-[#1e182f] h-1.5 rounded-full overflow-hidden">
            <div className="bg-[#fde68a] h-full rounded-full" style={{ width: '98.5%' }} />
          </div>
        </div>

        {/* Barre 3 */}
        <div>
          <div className="flex items-center justify-between text-xs font-mono mb-1">
            <span className="text-[#a599bf]">Taux d'erreurs HTTP</span>
            <span className="text-[#34d399] font-bold">0.0%</span>
          </div>
          <div className="w-full bg-[#1e182f] h-1.5 rounded-full overflow-hidden">
            <div className="bg-[#34d399] h-full rounded-full" style={{ width: '0%' }} />
          </div>
        </div>
      </div>

      {/* Footer explication */}
      <p className="text-[10px] font-mono text-[#625977] mt-3 pt-2 border-t border-[#231d34]">
        Indice basé sur la disponibilité et la latence moyenne de vos 4 projets.
      </p>

    </div>
  );
}
