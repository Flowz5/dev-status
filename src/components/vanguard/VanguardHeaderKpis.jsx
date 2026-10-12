import React from 'react';
import { ExternalLink, RefreshCw, CheckCircle2 } from 'lucide-react';

export function VanguardHeaderKpis({
  selectedService,
  services,
  onPingSelected
}) {
  const activeServices = services.filter(s => s.active !== false);
  const total = activeServices.length;

  const title = selectedService ? selectedService.name.toUpperCase() : "VUE D'ENSEMBLE DES SERVICES";
  const subtitle = selectedService ? selectedService.url : "Surveillance en temps réel de vos déploiements Vercel, Firebase et APIs";

  // Uptime
  const uptime = selectedService 
    ? (selectedService.uptimePercentage || 99.98).toFixed(2)
    : (activeServices.reduce((acc, s) => acc + (s.uptimePercentage || 100), 0) / (total || 1)).toFixed(2);

  // Latence
  const latency = selectedService
    ? (selectedService.responseTime || 118)
    : Math.round(activeServices.reduce((acc, s) => acc + (s.responseTime || 0), 0) / (activeServices.filter(s => s.responseTime > 0).length || 1));

  // Incidents
  const downCount = activeServices.filter(s => s.status === 'down').length;

  return (
    <div className="bg-[#161224] border border-[#251f38] rounded-2xl p-4 sm:p-6 shadow-xl">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        
        {/* Titre & 3 Grands Chiffres KPIs en Français */}
        <div className="w-full">
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="text-lg sm:text-2xl font-black tracking-tight text-white font-sans uppercase">
              {title}
            </h2>
            {selectedService && (
              <a 
                href={selectedService.url && /^https?:\/\//i.test(selectedService.url.trim()) ? selectedService.url.trim() : '#'} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-[#f97356] hover:text-[#ff8a70] transition flex items-center gap-1 text-xs font-mono"
                title="Ouvrir le site en direct"
              >
                <span>Visiter</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
          <p className="text-[11px] sm:text-xs text-[#827899] font-mono mt-0.5 truncate max-w-xl">
            {subtitle}
          </p>

          {/* Les 3 métriques claires et compréhensibles */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6 mt-4 sm:mt-5 pt-3 border-t border-[#231d34] sm:border-t-0 sm:pt-0">
            
            {/* KPI 1 : Disponibilité */}
            <div className="bg-[#120e1e] sm:bg-transparent p-2.5 sm:p-0 rounded-xl sm:rounded-none border border-[#231d34] sm:border-none">
              <div className="flex items-baseline justify-between sm:justify-start gap-2">
                <span className="text-xl sm:text-3xl font-black text-white font-mono tracking-tight">
                  {uptime}%
                </span>
                <span className="text-[11px] sm:text-xs font-mono text-[#8c829e]">
                  disponibilité (30j)
                </span>
              </div>
            </div>

            {/* KPI 2 : Latence moyenne */}
            <div className="bg-[#120e1e] sm:bg-transparent p-2.5 sm:p-0 rounded-xl sm:rounded-none border border-[#231d34] sm:border-none">
              <div className="flex items-baseline justify-between sm:justify-start gap-2">
                <span className="text-xl sm:text-3xl font-black text-[#f97356] font-mono tracking-tight">
                  {latency} ms
                </span>
                <span className="text-[11px] sm:text-xs font-mono text-[#8c829e]">
                  temps de réponse
                </span>
              </div>
            </div>

            {/* KPI 3 : Incidents en cours */}
            <div className="bg-[#120e1e] sm:bg-transparent p-2.5 sm:p-0 rounded-xl sm:rounded-none border border-[#231d34] sm:border-none">
              <div className="flex items-baseline justify-between sm:justify-start gap-2">
                <span className={`text-xl sm:text-3xl font-black font-mono tracking-tight ${downCount === 0 ? 'text-[#34d399]' : 'text-[#ef4444]'}`}>
                  {downCount === 0 ? '0' : downCount}
                </span>
                <span className="text-[11px] sm:text-xs font-mono text-[#8c829e]">
                  {downCount === 0 ? 'incident en cours' : 'service(s) en panne'}
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* Action directe sur le service sélectionné */}
        {selectedService && (
          <div className="flex items-center gap-3">
            <button
              onClick={() => onPingSelected(selectedService)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#271d2b] hover:bg-[#382638] text-xs font-mono font-bold text-[#f97356] border border-[#592b34] transition shadow-sm"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Tester {selectedService.name}</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
