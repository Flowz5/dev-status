import React, { useState } from 'react';
import { ArrowUpRight, ChevronDown, ChevronUp, Layers } from 'lucide-react';

export function VanguardSidebar({
  services,
  selectedServiceId,
  onSelectService,
  lastGlobalCheck,
  currentUser
}) {
  const [isMobileExpanded, setIsMobileExpanded] = useState(false);
  const activeServices = services.filter(s => s.active !== false);
  const total = activeServices.length;
  const avgUptime = total > 0
    ? (activeServices.reduce((acc, s) => acc + (s.uptimePercentage || 100), 0) / total).toFixed(2)
    : '100.00';

  const updatedTimeText = lastGlobalCheck
    ? new Date(lastGlobalCheck).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    : 'À l\'instant';

  const vercelCount = activeServices.filter(s => s.category === 'Vercel').length;
  const firebaseCount = activeServices.filter(s => s.category === 'Firebase').length;

  return (
    <aside className="w-full lg:w-72 xl:w-80 flex-shrink-0 flex flex-col gap-4">
      
      {/* Container Navigation Arborescente */}
      <div className="bg-[#161224] border border-[#251f38] rounded-2xl p-4 flex flex-col justify-between shadow-xl">
        
        <div>
          {/* Header de la sidebar en Français avec bouton accordéon mobile */}
          <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-[#7e7592] pb-3 border-b border-[#251f38]">
            <button
              onClick={() => setIsMobileExpanded(prev => !prev)}
              className="lg:pointer-events-none flex items-center gap-2 font-bold text-[#b4a9cc] hover:text-white lg:hover:text-[#b4a9cc] transition cursor-pointer"
            >
              <Layers className="w-3.5 h-3.5 text-[#f97356]" />
              <span>VOS PROJETS ({total})</span>
              <span className="lg:hidden text-[#f97356] ml-1">
                {isMobileExpanded ? <ChevronUp className="w-3.5 h-3.5 inline" /> : <ChevronDown className="w-3.5 h-3.5 inline" />}
              </span>
            </button>
            <div className="flex items-center gap-4 sm:gap-6">
              <span className="hidden sm:inline">LATENCE</span>
              <span>ÉTAT</span>
            </div>
          </div>

          {/* Arborescence (Tree) - Toujours visible sur lg, repliable sur mobile */}
          <div className={`mt-3 space-y-1 ${isMobileExpanded ? 'block' : 'hidden lg:block'}`}>
            
            {/* Nœud Racine (Vue Globale) */}
            <div
              onClick={() => onSelectService(null)}
              className={`rounded-xl p-2.5 transition cursor-pointer border ${
                selectedServiceId === null
                  ? 'bg-[#311d24] border-[#672f2d] text-[#f97356]'
                  : 'bg-[#1b162b] border-[#251f38] text-white hover:border-[#382e52]'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[#f97356] font-bold text-xs">→</span>
                  <span className="text-xs font-bold font-sans tracking-tight text-white">
                    Tous les projets (Vue globale)
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs font-mono">
                  <span className="font-bold text-[#f97356]">{total} apps</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#f97356]" />
                </div>
              </div>

              {/* Sous-branches réelles */}
              {selectedServiceId === null && (
                <div className="mt-2.5 ml-3 pl-3 border-l border-[#542d32] space-y-1.5 text-[11px] font-mono text-[#c5b5bb]">
                  <div className="flex items-center justify-between hover:text-white transition">
                    <span className="flex items-center gap-1.5">
                      <span className="w-1.5 h-px bg-[#f97356]" />
                      Projets Vercel
                    </span>
                    <span className="text-[#e2a89c]">{vercelCount} apps</span>
                  </div>
                  <div className="flex items-center justify-between hover:text-white transition">
                    <span className="flex items-center gap-1.5">
                      <span className="w-1.5 h-px bg-[#f97356]" />
                      Projets Firebase
                    </span>
                    <span className="text-[#e2a89c]">{firebaseCount} app</span>
                  </div>
                  <div className="flex items-center justify-between hover:text-white transition">
                    <span className="flex items-center gap-1.5">
                      <span className="w-1.5 h-px bg-[#f97356]" />
                      Vérification Cron
                    </span>
                    <span className="text-[#34d399]">15 min</span>
                  </div>
                </div>
              )}
            </div>

            {/* Liste de chaque service réel */}
            <div className="pt-2 space-y-1">
              {services.map((service) => {
                const isSelected = selectedServiceId === service.id;
                const latency = service.responseTime ? `${service.responseTime} ms` : '—';
                const isOperational = service.status === 'operational';

                return (
                  <div
                    key={service.id}
                    onClick={() => onSelectService(service.id)}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-mono transition cursor-pointer border ${
                      isSelected
                        ? 'bg-[#311d24] border-[#672f2d] text-[#f97356]'
                        : 'bg-transparent border-transparent text-[#b0a5c7] hover:bg-[#1f1a30] hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate pr-2">
                      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${isOperational ? 'bg-[#34d399]' : 'bg-[#ef4444]'}`} />
                      <span className="truncate font-sans font-medium text-white">
                        {service.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 flex-shrink-0">
                      <span className={`font-mono text-[11px] ${isSelected ? 'text-[#f97356] font-bold' : 'text-[#877d9c]'}`}>
                        {latency}
                      </span>
                      <ArrowUpRight className={`w-3.5 h-3.5 ${isSelected ? 'text-[#f97356]' : 'text-[#564e6b]'}`} />
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </div>

        {/* Section Inférieure : ÉTAT DU MONITORING */}
        <div className={`mt-6 pt-4 border-t border-[#251f38] bg-[#120e1e] p-3 rounded-xl border border-[#231d34] ${isMobileExpanded ? 'block' : 'hidden lg:block'}`}>
          <h4 className="text-[10px] font-mono uppercase tracking-wider text-[#827899] font-bold mb-2">
            RÉSUMÉ DU SYSTÈME
          </h4>

          <div className="space-y-1.5 text-xs font-mono">
            <div className="flex items-center justify-between text-[#a095b8]">
              <span>Applications surveillées</span>
              <span className="text-white font-bold">{total}</span>
            </div>
            <div className="flex items-center justify-between text-[#a095b8]">
              <span>Disponibilité globale</span>
              <span className="text-[#f97356] font-bold">{avgUptime}%</span>
            </div>
            <div className="flex items-center justify-between text-[#a095b8]">
              <span>Intervalle de ping</span>
              <span className="text-white font-bold">15 min</span>
            </div>
            <div className="flex items-center justify-between pt-1 border-t border-[#231d34]">
              <span>Santé générale</span>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-[#113123] text-[#34d399] border border-[#1b4b35]">
                OPÉRATIONNEL
              </span>
            </div>
          </div>

          <p className="text-[10px] text-[#635b75] mt-2 font-mono">
            Dernier check : {updatedTimeText}
          </p>
        </div>

      </div>

    </aside>
  );
}
