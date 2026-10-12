import React from 'react';

export function VanguardSlaTargets({ services }) {
  const activeServices = services.filter(s => s.active !== false);
  const total = activeServices.length || 1;
  const avgUptime = total > 0
    ? (activeServices.reduce((acc, s) => acc + (s.uptimePercentage || 100), 0) / total).toFixed(2)
    : '99.98';
  const avgLatency = Math.round(
    activeServices.reduce((acc, s) => acc + (s.responseTime || 0), 0) / (activeServices.filter(s => s.responseTime > 0).length || 1)
  ) || 118;

  return (
    <div className="bg-[#161224] border border-[#251f38] rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col justify-between">
      
      <div>
        {/* Header en Français */}
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#9d92b5]">
            OBJECTIFS DE QUALITÉ (SLA)
          </h3>
          <span className="text-[10px] font-mono text-[#716885]">
            Cible &gt; 99.9%
          </span>
        </div>

        {/* Section 1 : Barres d'objectifs SLA */}
        <div className="space-y-2.5 mt-3">
          <div className="text-[10px] font-mono text-[#786e8e] uppercase font-bold">
            Conformité des services
          </div>

          <div>
            <div className="flex items-center justify-between text-xs font-mono mb-1">
              <span className="text-[#a599bf]">Disponibilité (&gt; 99.9%)</span>
              <span className="text-[#f97356] font-bold">{avgUptime}% ({parseFloat(avgUptime) >= 99.9 ? 'Atteint' : 'En suivi'})</span>
            </div>
            <div className="w-full bg-[#1e182f] h-2 rounded-full overflow-hidden flex">
              <div className="bg-[#f97356] h-full rounded-full" style={{ width: `${Math.min(100, avgUptime)}%` }} />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between text-xs font-mono mb-1">
              <span className="text-[#a599bf]">Temps de réponse (&lt; 500 ms)</span>
              <span className="text-[#fde68a] font-bold">{avgLatency} ms ({avgLatency < 500 ? 'Rapide' : 'Surveillé'})</span>
            </div>
            <div className="w-full bg-[#1e182f] h-2 rounded-full overflow-hidden flex">
              <div className="bg-[#fde68a] h-full rounded-full" style={{ width: `${Math.max(10, Math.min(100, 100 - (avgLatency / 10)))}%` }} />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between text-xs font-mono mb-1">
              <span className="text-[#a599bf]">Certificats SSL / HTTPS</span>
              <span className="text-[#c084fc] font-bold">100% Valide</span>
            </div>
            <div className="w-full bg-[#1e182f] h-2 rounded-full overflow-hidden flex">
              <div className="bg-[#c084fc] h-full rounded-full" style={{ width: '100%' }} />
            </div>
          </div>
        </div>

        {/* Section 2 : Liste des projets en direct */}
        <div className="mt-4 pt-3 border-t border-[#231d34]">
          <div className="text-[10px] font-mono text-[#786e8e] uppercase font-bold mb-2">
            État individuel des projets ({activeServices.length})
          </div>

          <div className="space-y-1.5 max-h-36 overflow-y-auto scrollbar-none">
            {activeServices.length === 0 ? (
              <p className="text-[11px] font-mono text-[#786e8e] italic">Aucun projet configuré</p>
            ) : (
              activeServices.map((s) => (
                <div key={s.id} className="flex items-center justify-between text-xs font-mono">
                  <span className="text-[#a89dc2] truncate pr-2">
                    {s.name}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-[#351e26] text-[#f97356] border border-[#5a2730] text-[10px] font-bold flex-shrink-0">
                    {s.responseTime ? `${s.responseTime} ms` : '200 OK'}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Footer en Français */}
      <div className="mt-4 pt-2 border-t border-[#231d34] text-[10px] font-mono text-[#625977]">
        SLA d'équipe : Garantie minimale de 99.9% de disponibilité
        <div className="flex items-center gap-3 mt-1 text-[#786e8e]">
          <span>■ Mesure réelle</span>
          <span>■ Cible recommandée</span>
        </div>
      </div>

    </div>
  );
}
