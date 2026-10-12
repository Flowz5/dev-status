import React from 'react';

export function VanguardTechMixBar({ services }) {
  const activeServices = services.filter(s => s.active !== false);
  const total = activeServices.length || 1;

  const vercelCount = activeServices.filter(s => s.category === 'Vercel').length;
  const firebaseCount = activeServices.filter(s => s.category === 'Firebase').length;
  const otherCount = activeServices.filter(s => s.category !== 'Vercel' && s.category !== 'Firebase').length;

  const vercelPct = Math.round((vercelCount / total) * 100);
  const firebasePct = Math.round((firebaseCount / total) * 100);
  const otherPct = Math.max(0, 100 - vercelPct - firebasePct);

  return (
    <div className="bg-[#161224] border border-[#251f38] rounded-2xl p-5 shadow-xl flex flex-col justify-between">
      
      {/* En-tête en Français */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#9d92b5]">
          RÉPARTITION DES ENVIRONNEMENTS
        </h3>
        <span className="text-[11px] font-mono text-[#716885]">
          Vercel & Firebase
        </span>
      </div>

      {/* Barre Horizontale Multi-Segmentée */}
      <div>
        <div className="flex items-center justify-between text-[11px] font-mono text-[#7a718f] mb-1.5">
          <span>Vercel ({vercelPct}%)</span>
          <span>Firebase ({firebasePct}%)</span>
          <span>APIs & Autres ({otherPct}%)</span>
        </div>

        <div className="w-full h-8 rounded-xl overflow-hidden flex p-0.5 bg-[#100d1c] border border-[#231d34] gap-0.5">
          {/* Segment 1 : Vercel */}
          <div
            style={{ width: `${vercelPct}%` }}
            className="h-full bg-[#f97356] rounded-l-lg flex items-center justify-center text-xs font-bold font-mono text-white transition-all duration-500 shadow-sm"
            title={`Vercel: ${vercelCount} projet(s)`}
          >
            {vercelPct}% Vercel
          </div>

          {/* Segment 2 : Firebase */}
          <div
            style={{ width: `${firebasePct}%` }}
            className="h-full bg-[#fde68a] text-[#291b00] flex items-center justify-center text-xs font-bold font-mono transition-all duration-500 shadow-sm"
            title={`Firebase: ${firebaseCount} projet(s)`}
          >
            {firebasePct}% Firebase
          </div>

          {/* Segment 3 : Autre */}
          {otherPct > 0 && (
            <div
              style={{ width: `${otherPct}%` }}
              className="h-full bg-[#c084fc] rounded-r-lg text-white flex items-center justify-center text-[10px] font-bold font-mono transition-all duration-500"
              title="Autres services"
            >
              {otherPct}%
            </div>
          )}
        </div>
      </div>

      {/* Grille des 4 Cartes en dessous en Français */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-4 pt-3 border-t border-[#231d34]">
        
        {/* Métrique 1 */}
        <div className="bg-[#120e1e] p-2.5 rounded-xl border border-[#231d34]">
          <span className="text-[10px] font-mono font-bold uppercase text-[#f97356] block truncate">
            Projets Vercel
          </span>
          <span className="text-base font-black text-white font-mono block mt-1">
            {vercelCount} apps
          </span>
          <span className="text-[10px] text-[#34d399] font-mono block mt-0.5">
            100% en ligne
          </span>
        </div>

        {/* Métrique 2 */}
        <div className="bg-[#120e1e] p-2.5 rounded-xl border border-[#231d34]">
          <span className="text-[10px] font-mono font-bold uppercase text-[#fde68a] block truncate">
            Projets Firebase
          </span>
          <span className="text-base font-black text-white font-mono block mt-1">
            {firebaseCount} app
          </span>
          <span className="text-[10px] text-[#34d399] font-mono block mt-0.5">
            54 ms latence
          </span>
        </div>

        {/* Métrique 3 */}
        <div className="bg-[#120e1e] p-2.5 rounded-xl border border-[#231d34]">
          <span className="text-[10px] font-mono font-bold uppercase text-[#c084fc] block truncate">
            Outils Internes
          </span>
          <span className="text-base font-black text-white font-mono block mt-1">
            1 app
          </span>
          <span className="text-[10px] text-[#a095b8] font-mono block mt-0.5">
            Tab Prospection
          </span>
        </div>

        {/* Métrique 4 */}
        <div className="bg-[#120e1e] p-2.5 rounded-xl border border-[#231d34]">
          <span className="text-[10px] font-mono font-bold uppercase text-[#34d399] block truncate">
            Garantie SLA
          </span>
          <span className="text-base font-black text-white font-mono block mt-1">
            99.9%
          </span>
          <span className="text-[10px] text-[#34d399] font-mono block mt-0.5 font-bold">
            Respecté
          </span>
        </div>

      </div>

    </div>
  );
}
