import React from 'react';
import { ExternalLink, RefreshCw } from 'lucide-react';

export function VanguardHeaderKpis({
  selectedService,
  services,
  onPingSelected
}) {
  const activeServices = services.filter(s => s.active !== false);
  const total = activeServices.length;

  const title = selectedService ? selectedService.name.toUpperCase() : "DEVSTATUS PRODUCTION HUB";
  const subtitle = selectedService ? selectedService.url : "CORE INFRASTRUCTURE & MULTI-CLOUD STATUS";

  // Uptime
  const uptime = selectedService 
    ? (selectedService.uptimePercentage || 99.98).toFixed(2)
    : (activeServices.reduce((acc, s) => acc + (s.uptimePercentage || 100), 0) / (total || 1)).toFixed(2);

  // Latence
  const latency = selectedService
    ? (selectedService.responseTime || 118)
    : Math.round(activeServices.reduce((acc, s) => acc + (s.responseTime || 0), 0) / (activeServices.filter(s => s.responseTime > 0).length || 1));

  const teamAvatars = [
    { label: 'JD', bg: 'bg-[#f97356]' },
    { label: 'MS', bg: 'bg-[#fb923c]' },
    { label: 'LC', bg: 'bg-[#fde68a] text-black' },
    { label: 'KA', bg: 'bg-[#c084fc]' },
    { label: 'RB', bg: 'bg-[#818cf8]' }
  ];

  return (
    <div className="bg-[#161224] border border-[#251f38] rounded-2xl p-5 sm:p-6 shadow-xl">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        
        {/* Titre & 3 Grands Chiffres KPIs */}
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white font-sans uppercase">
              {title}
            </h2>
            {selectedService && (
              <a 
                href={selectedService.url} 
                target="_blank" 
                rel="noreferrer" 
                className="text-[#f97356] hover:text-[#ff8a70] transition"
                title="Ouvrir le site"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
          <p className="text-xs text-[#827899] font-mono mt-0.5 truncate max-w-xl">
            {subtitle}
          </p>

          {/* Les 3 métriques style Vanguard */}
          <div className="flex items-baseline gap-6 sm:gap-10 mt-5 flex-wrap">
            
            {/* KPI 1 : Disponibilité */}
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">
                  {uptime}%
                </span>
                <span className="text-xs font-mono text-[#8c829e]">
                  uptime rate
                </span>
              </div>
            </div>

            {/* KPI 2 : Latence / Net change */}
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-black text-[#f97356] font-mono tracking-tight">
                  +{latency} ms
                </span>
                <span className="text-xs font-mono text-[#8c829e]">
                  avg response
                </span>
              </div>
            </div>

            {/* KPI 3 : Cycle de vérification */}
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">
                  15 min
                </span>
                <span className="text-xs font-mono text-[#8c829e]">
                  cron check interval
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* Côté Droit : Avatars Équipe & Action directe */}
        <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-between gap-3">
          
          <div className="text-left lg:text-right">
            {/* Pile d'avatars */}
            <div className="flex items-center -space-x-1.5">
              {teamAvatars.map((member, idx) => (
                <div
                  key={idx}
                  className={`w-7 h-7 rounded-full border-2 border-[#161224] ${member.bg} flex items-center justify-center text-[10px] font-bold font-mono text-white shadow-sm`}
                  title={`Team Member ${member.label}`}
                >
                  {member.label}
                </div>
              ))}
            </div>
            <p className="text-[11px] text-[#716885] font-mono mt-1.5">
              devops & engineering team
            </p>
          </div>

          {selectedService && (
            <button
              onClick={() => onPingSelected(selectedService)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#271d2b] hover:bg-[#382638] text-xs font-mono text-[#f97356] border border-[#592b34] transition"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Ping Now</span>
            </button>
          )}

        </div>

      </div>
    </div>
  );
}
