import React from 'react';

export function VanguardSlaTargets({ services }) {
  return (
    <div className="bg-[#161224] border border-[#251f38] rounded-2xl p-5 shadow-xl flex flex-col justify-between">
      
      <div>
        {/* Header style Vanguard */}
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#9d92b5]">
            (c) SERVICE LEVEL TARGETS & SLA
          </h3>
          <span className="text-[10px] font-mono text-[#716885]">
            Target &gt;99.9%
          </span>
        </div>

        {/* Section 1 : Barres de couverture SLA avec cibles */}
        <div className="space-y-2.5 mt-3">
          <div className="text-[10px] font-mono text-[#786e8e] uppercase font-bold">
            Core Target Coverage
          </div>

          <div>
            <div className="flex items-center justify-between text-xs font-mono mb-1">
              <span className="text-[#a599bf]">Availability SLA</span>
              <span className="text-[#f97356] font-bold">99.98% / 99.9% Tar</span>
            </div>
            <div className="w-full bg-[#1e182f] h-2 rounded-full overflow-hidden flex">
              <div className="bg-[#f97356] h-full rounded-full" style={{ width: '99.9%' }} />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between text-xs font-mono mb-1">
              <span className="text-[#a599bf]">Response Speed (&lt;500ms)</span>
              <span className="text-[#fde68a] font-bold">98.5% / 95% Tar</span>
            </div>
            <div className="w-full bg-[#1e182f] h-2 rounded-full overflow-hidden flex">
              <div className="bg-[#fde68a] h-full rounded-full" style={{ width: '98.5%' }} />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between text-xs font-mono mb-1">
              <span className="text-[#a599bf]">HTTPS & SSL Handshake</span>
              <span className="text-[#c084fc] font-bold">100% / 100% Tar</span>
            </div>
            <div className="w-full bg-[#1e182f] h-2 rounded-full overflow-hidden flex">
              <div className="bg-[#c084fc] h-full rounded-full" style={{ width: '100%' }} />
            </div>
          </div>
        </div>

        {/* Section 2 : Specialty Reach Pills style Vanguard */}
        <div className="mt-4 pt-3 border-t border-[#231d34]">
          <div className="text-[10px] font-mono text-[#786e8e] uppercase font-bold mb-2">
            Endpoints Health Reach
          </div>

          <div className="space-y-1.5">
            {services.map((s) => (
              <div key={s.id} className="flex items-center justify-between text-xs font-mono">
                <span className="text-[#a89dc2] truncate pr-2">
                  {s.name}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-[#351e26] text-[#f97356] border border-[#5a2730] text-[10px] font-bold flex-shrink-0">
                  {s.responseTime ? `${s.responseTime}ms` : '200 OK'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer style Vanguard */}
      <div className="mt-4 pt-2 border-t border-[#231d34] text-[10px] font-mono text-[#625977]">
        Regional Access Target: ≥ 99.9% across clusters
        <div className="flex items-center gap-3 mt-1 text-[#786e8e]">
          <span>Legend: ■ Cluster Actual</span>
          <span>■ Regional Baseline</span>
        </div>
      </div>

    </div>
  );
}
