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
      
      {/* En-tête style Vanguard */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#9d92b5]">
          (b) PLATFORM CAPACITY & TECH MIX
        </h3>
        <span className="text-[11px] font-mono text-[#716885]">
          Infrastructure Split
        </span>
      </div>

      {/* Barre Horizontale Multi-Segmentée */}
      <div>
        <div className="flex items-center justify-between text-[11px] font-mono text-[#7a718f] mb-1.5">
          <span>Vercel Edge</span>
          <span>Firebase Hosting</span>
          <span>Cloud Functions</span>
          <span>External APIs</span>
        </div>

        <div className="w-full h-8 rounded-xl overflow-hidden flex p-0.5 bg-[#100d1c] border border-[#231d34] gap-0.5">
          {/* Segment 1 : Vercel */}
          <div
            style={{ width: `${vercelPct}%` }}
            className="h-full bg-[#f97356] rounded-l-lg flex items-center justify-center text-xs font-bold font-mono text-white transition-all duration-500 shadow-sm"
            title={`Vercel: ${vercelPct}%`}
          >
            {vercelPct}%
          </div>

          {/* Segment 2 : Firebase */}
          <div
            style={{ width: `${firebasePct}%` }}
            className="h-full bg-[#fde68a] text-[#291b00] flex items-center justify-center text-xs font-bold font-mono transition-all duration-500 shadow-sm"
            title={`Firebase: ${firebasePct}%`}
          >
            {firebasePct}%
          </div>

          {/* Segment 3 : Fallback / Autre */}
          <div
            style={{ width: `${otherPct > 0 ? otherPct : 5}%` }}
            className="h-full bg-[#c084fc] rounded-r-lg text-white flex items-center justify-center text-[10px] font-bold font-mono transition-all duration-500"
            title="Others & APIs"
          >
            {otherPct > 0 ? `${otherPct}%` : ''}
          </div>
        </div>
      </div>

      {/* Grille des 4 Métriques en dessous de la barre */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-4 pt-3 border-t border-[#231d34]">
        
        {/* Métrique 1 */}
        <div className="bg-[#120e1e] p-2.5 rounded-xl border border-[#231d34]">
          <span className="text-[10px] font-mono font-bold uppercase text-[#f97356] block truncate">
            Vercel Edge
          </span>
          <span className="text-base font-black text-white font-mono block mt-1">
            {vercelCount} Apps
          </span>
          <span className="text-[10px] text-[#7a718f] font-mono block mt-0.5">
            100% Up
          </span>
        </div>

        {/* Métrique 2 */}
        <div className="bg-[#120e1e] p-2.5 rounded-xl border border-[#231d34]">
          <span className="text-[10px] font-mono font-bold uppercase text-[#fde68a] block truncate">
            Firebase
          </span>
          <span className="text-base font-black text-white font-mono block mt-1">
            {firebaseCount} App
          </span>
          <span className="text-[10px] text-[#7a718f] font-mono block mt-0.5">
            54 ms fast
          </span>
        </div>

        {/* Métrique 3 */}
        <div className="bg-[#120e1e] p-2.5 rounded-xl border border-[#231d34]">
          <span className="text-[10px] font-mono font-bold uppercase text-[#c084fc] block truncate">
            Internal Tools
          </span>
          <span className="text-base font-black text-white font-mono block mt-1">
            1 App
          </span>
          <span className="text-[10px] text-[#7a718f] font-mono block mt-0.5">
            Active
          </span>
        </div>

        {/* Métrique 4 */}
        <div className="bg-[#120e1e] p-2.5 rounded-xl border border-[#231d34]">
          <span className="text-[10px] font-mono font-bold uppercase text-[#34d399] block truncate">
            Global SLA
          </span>
          <span className="text-base font-black text-white font-mono block mt-1">
            99.98%
          </span>
          <span className="text-[10px] text-[#34d399] font-mono block mt-0.5 font-bold">
            OPTIMAL
          </span>
        </div>

      </div>

    </div>
  );
}
