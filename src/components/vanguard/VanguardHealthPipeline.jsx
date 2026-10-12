import React from 'react';
import { ArrowUpRight } from 'lucide-react';

export function VanguardHealthPipeline({ services }) {
  const activeCount = services.filter(s => s.active !== false).length;

  const pipelineItems = [
    {
      title: 'Production Critical Hub',
      badge: 'OPTIMAL',
      badgeClass: 'bg-[#143224] text-[#34d399] border-[#1d4c36]',
      cases: '2 apps',
      wait: 'Avg 85ms wait'
    },
    {
      title: 'Vercel Edge Frontends',
      badge: 'STABLE',
      badgeClass: 'bg-[#3b2326] text-[#f97356] border-[#5e2e34]',
      cases: '3 apps',
      wait: 'Avg 145ms wait'
    },
    {
      title: 'Firebase Realtime Store',
      badge: 'LIGHTNING',
      badgeClass: 'bg-[#38331d] text-[#fde68a] border-[#5c542b]',
      cases: '1 app',
      wait: 'Avg 54ms wait'
    },
    {
      title: 'Automated GitHub Cron',
      badge: 'SCHEDULED',
      badgeClass: 'bg-[#261d36] text-[#c084fc] border-[#443161]',
      cases: '15m cycle',
      wait: 'Avg 100% SLA'
    }
  ];

  return (
    <div className="bg-[#161224] border border-[#251f38] rounded-2xl p-5 shadow-xl flex flex-col justify-between">
      
      <div>
        {/* Header style Vanguard */}
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#9d92b5]">
            (a) HEALTH PIPELINE & INTAKE
          </h3>
          <span className="text-[10px] font-mono text-[#716885]">
            Live Queue
          </span>
        </div>

        {/* Liste des items de pipeline avec badges */}
        <div className="space-y-3 mt-3">
          {pipelineItems.map((item, idx) => (
            <div key={idx} className="pb-2.5 border-b border-[#211a30] last:border-0 last:pb-0">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white font-sans">
                  {item.title}
                </span>
                <span className={`px-2 py-0.5 text-[9px] font-bold font-mono rounded-md border ${item.badgeClass}`}>
                  {item.badge}
                </span>
              </div>
              <div className="flex items-center gap-3 text-[11px] font-mono text-[#8a7f9e] mt-1">
                <span className="text-white font-bold">{item.cases}</span>
                <span>•</span>
                <span>{item.wait}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Carte Inférieure : 28.4 Hrs / Avg Response Allocation */}
      <div className="mt-5 pt-3 border-t border-[#231d34]">
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-black text-[#f97356] font-mono tracking-tight">
            118.5 ms
          </span>
        </div>
        <p className="text-[11px] font-mono text-[#9186a8] mt-0.5">
          Avg Response Allocation Time
        </p>
        <div className="flex items-center gap-2 mt-1 text-[11px] font-mono text-[#34d399]">
          <span>-18ms improved vs Q3 avg</span>
        </div>
        <p className="text-[10px] font-mono text-[#34d399] mt-0.5 font-bold">
          ✔ Exceeds regional service target
        </p>
      </div>

    </div>
  );
}
