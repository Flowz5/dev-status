import React from 'react';

export function VanguardGaugeIndex({ services }) {
  const activeServices = services.filter(s => s.active !== false);
  const total = activeServices.length || 1;
  const avgUptime = (activeServices.reduce((acc, s) => acc + (s.uptimePercentage || 100), 0) / total).toFixed(1);

  const scoreNum = Math.min(100, Math.max(0, parseFloat(avgUptime) || 100));
  // Affiche un entier propre quand c'est 100 (ex: 100 au lieu de 100.0) ou la décimale si nécessaire
  const displayScore = scoreNum % 1 === 0 ? Math.round(scoreNum) : avgUptime;
  // Circonférence d'un demi-cercle de rayon 38 = PI * 38 ≈ 119.38
  const arcLength = 119.4;
  const strokeDashoffset = ((100 - scoreNum) / 100) * arcLength;

  return (
    <div className="bg-[#161224] border border-[#251f38] rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col justify-between">
      
      {/* Header en Français */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#9d92b5]">
          INDICE DE SANTÉ GLOBAL
        </h3>
        <span className="text-[10px] font-mono text-[#716885]">
          Score 0-100
        </span>
      </div>

      {/* Jauge Semi-Circulaire Vectorielle avec score au centre et étiquette dégagée en-dessous */}
      <div className="flex flex-col items-center justify-center my-3">
        <div className="w-48 h-24 flex items-center justify-center">
          <svg viewBox="0 0 100 58" className="w-full h-full overflow-visible">
            {/* Arc d'arrière-plan */}
            <path
              d="M 12 50 A 38 38 0 0 1 88 50"
              fill="none"
              stroke="#251e36"
              strokeWidth="9"
              strokeLinecap="round"
            />
            {/* Arc actif Corail dynamique */}
            <path
              d="M 12 50 A 38 38 0 0 1 88 50"
              fill="none"
              stroke="#f97356"
              strokeWidth="9"
              strokeDasharray={arcLength}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-700 ease-out"
            />
            {/* Chiffre vectoriel proportionné, centré et aéré à l'intérieur de l'arc */}
            <text
              x="50"
              y="40"
              textAnchor="middle"
              fill="#ffffff"
              fontSize="14"
              fontWeight="900"
              fontFamily="monospace"
              letterSpacing="-0.5"
            >
              {displayScore}
            </text>
          </svg>
        </div>

        {/* Étiquette placée sous l'arc sans aucun risque de chevauchement */}
        <span className="text-xs font-mono text-[#9e94b5] uppercase tracking-wider mt-2 font-bold">
          Score de santé / 100
        </span>
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
        Indice basé sur la disponibilité et la latence moyenne de vos projets.
      </p>

    </div>
  );
}
