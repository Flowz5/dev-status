import React, { useState } from 'react';
import { ExternalLink, RefreshCw, Trash2, Edit3, CheckCircle2, AlertTriangle, XCircle, Clock, Zap } from 'lucide-react';

export function ServiceCard({
  service,
  isAdminMode,
  onPing,
  onEdit,
  onDelete
}) {
  const [isPinging, setIsPinging] = useState(false);
  const [hoveredCheck, setHoveredCheck] = useState(null);

  const handlePing = async () => {
    setIsPinging(true);
    try {
      await onPing(service);
    } finally {
      setIsPinging(false);
    }
  };

  // Statuts & Couleurs dans le thème Vanguard
  const statusConfig = {
    operational: {
      label: 'Opérationnel',
      badgeClass: 'bg-[#132d20] text-[#34d399] border-[#1d4c36]',
      dotClass: 'bg-[#34d399]',
      icon: CheckCircle2,
      borderClass: 'hover:border-[#34d399]/40'
    },
    degraded: {
      label: 'Ralenti',
      badgeClass: 'bg-[#3a3219] text-[#fde68a] border-[#5a4d25]',
      dotClass: 'bg-[#fde68a]',
      icon: AlertTriangle,
      borderClass: 'hover:border-[#fde68a]/40'
    },
    down: {
      label: 'Hors Ligne',
      badgeClass: 'bg-[#381a1f] text-[#ef4444] border-[#59222c]',
      dotClass: 'bg-[#ef4444]',
      icon: XCircle,
      borderClass: 'hover:border-[#ef4444]/40'
    }
  };

  const currentStatus = statusConfig[service.status] || statusConfig.operational;
  const StatusIcon = currentStatus.icon;

  // Catégorie badges style Vanguard
  const categoryColors = {
    Vercel: 'bg-[#1f1a30] text-[#f97356] border-[#382638]',
    Firebase: 'bg-[#292218] text-[#fde68a] border-[#473922]',
    'API Backend': 'bg-[#201a35] text-[#c084fc] border-[#3c2a63]',
    Autre: 'bg-[#1a162b] text-[#9d92b5] border-[#251f38]'
  };

  const categoryBadge = categoryColors[service.category] || categoryColors.Autre;

  // Historique des 30 dernières vérifications
  const history = service.history || [];
  const paddedHistory = [...Array(Math.max(0, 30 - history.length)).fill(null), ...history].slice(-30);

  const lastCheckText = service.lastCheck 
    ? new Date(service.lastCheck).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    : 'À l\'instant';

  return (
    <div className={`bg-[#161224] border border-[#251f38] rounded-2xl p-4 sm:p-6 shadow-xl transition-all duration-200 group ${currentStatus.borderClass}`}>
      
      {/* En-tête de la carte */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#1b162b] border border-[#251f38] flex items-center justify-center flex-shrink-0 text-white group-hover:border-[#382e52] transition">
            <StatusIcon className={`w-4 h-4 sm:w-5 sm:h-5 ${service.status === 'operational' ? 'text-[#34d399]' : service.status === 'degraded' ? 'text-[#fde68a]' : 'text-[#ef4444]'}`} />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm sm:text-base font-bold text-white tracking-tight font-sans truncate">
                {service.name}
              </h3>
              <span className={`text-[10px] sm:text-[11px] font-mono px-2 py-0.5 rounded-md border ${categoryBadge}`}>
                {service.category || 'App'}
              </span>
              <span className={`text-[11px] sm:text-xs font-mono font-semibold px-2 sm:px-2.5 py-0.5 rounded-md border flex items-center gap-1.5 ${currentStatus.badgeClass}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${currentStatus.dotClass} animate-pulse`} />
                {currentStatus.label}
              </span>
            </div>

            <div className="flex items-center gap-2 mt-1">
              <a
                href={service.url && /^https?:\/\//i.test(service.url.trim()) ? service.url.trim() : '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] sm:text-xs text-[#8f85a8] hover:text-[#f97356] transition flex items-center gap-1 truncate max-w-[240px] sm:max-w-md font-mono"
              >
                <span className="truncate">{service.url}</span>
                <ExternalLink className="w-3 h-3 flex-shrink-0 opacity-70" />
              </a>
            </div>
          </div>
        </div>

        {/* Métriques instantanées (Code HTTP & Latence & Actions) */}
        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap sm:flex-nowrap w-full sm:w-auto justify-between sm:justify-end pt-2 sm:pt-0 border-t border-[#231d34] sm:border-t-0">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-[#100d1c] border border-[#231d34] text-xs font-mono">
              <span className="text-[#7e7494]">HTTP</span>
              <span className={`font-bold ${service.statusCode >= 200 && service.statusCode < 400 ? 'text-[#34d399]' : 'text-[#ef4444]'}`}>
                {service.statusCode || 200}
              </span>
            </div>

            <div className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-[#100d1c] border border-[#231d34] text-xs font-mono">
              <Zap className="w-3.5 h-3.5 text-[#f97356]" />
              <span className="font-bold text-[#f97356]">
                {service.responseTime ? `${service.responseTime} ms` : '—'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Bouton Ping individuel */}
            <button
              onClick={handlePing}
              disabled={isPinging}
              className="p-2 rounded-xl bg-[#1b162b] hover:bg-[#251f38] text-[#a599bf] hover:text-white border border-[#251f38] transition disabled:opacity-50 cursor-pointer"
              title="Tester immédiatement ce service"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isPinging ? 'animate-spin text-[#f97356]' : ''}`} />
            </button>

            {/* Actions d'administration */}
            {isAdminMode && (
              <div className="flex items-center gap-1 border-l border-[#251f38] pl-1.5">
                <button
                  onClick={() => onEdit(service)}
                  className="p-2 rounded-xl bg-[#1b162b] hover:bg-[#311d24] text-[#a599bf] hover:text-[#f97356] border border-[#251f38] transition cursor-pointer"
                  title="Modifier"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onDelete(service.id)}
                  className="p-2 rounded-xl bg-[#1b162b] hover:bg-[#381a1f] text-[#a599bf] hover:text-[#ef4444] border border-[#251f38] transition cursor-pointer"
                  title="Supprimer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Description du service si présente */}
      {service.description && (
        <p className="text-xs text-[#8f85a8] mb-4 font-sans line-clamp-1">
          {service.description}
        </p>
      )}

      {/* Section Uptime Timeline (30 vérifications récentes) dans le thème Vanguard */}
      <div className="mt-4 pt-4 border-t border-[#231d34]">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs mb-2 font-mono">
          <div className="flex items-center gap-2">
            <span className="text-[#8f85a8]">Disponibilité récente</span>
            <span className="text-[#f97356] font-bold">
              {service.uptimePercentage || 100}% uptime
            </span>
          </div>

          <div className="flex items-center gap-1 text-[11px] text-[#716885]">
            <Clock className="w-3 h-3" />
            <span>Dernier contrôle : {lastCheckText}</span>
          </div>
        </div>

        {/* Barre de 30 segments dans le style Vanguard avec scroll horizontal fluide si nécessaire */}
        <div className="relative">
          <div className="overflow-x-auto scrollbar-none pb-1 -mx-1 px-1">
            <div className="grid grid-cols-30 gap-[2px] sm:gap-1 h-7 sm:h-8 items-end bg-[#100d1c] p-1.5 rounded-xl border border-[#231d34] min-w-[280px]">
              {paddedHistory.map((item, idx) => {
                if (!item) {
                  return (
                    <div
                      key={idx}
                      className="h-full rounded-sm bg-[#1e182f]"
                      title="En attente de données"
                    />
                  );
                }

                // Couleurs Vanguard pour les barres
                let colorClass = 'bg-[#34d399] hover:bg-[#4ade80]';
                if (item.status === 'down') colorClass = 'bg-[#ef4444] hover:bg-[#f87171]';
                else if (item.status === 'degraded') colorClass = 'bg-[#fde68a] hover:bg-[#fef08a]';

                return (
                  <div
                    key={idx}
                    onMouseEnter={() => setHoveredCheck(item)}
                    onMouseLeave={() => setHoveredCheck(null)}
                    className={`h-full rounded-sm transition-all duration-150 cursor-pointer ${colorClass}`}
                  />
                );
              })}
            </div>
          </div>

          {/* Tooltip interactif au survol d'une barre */}
          {hoveredCheck && (
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-[#120e1e] border border-[#392d4f] text-white text-xs px-3 py-1.5 rounded-lg shadow-2xl pointer-events-none flex items-center gap-3 z-20 whitespace-nowrap font-mono">
              <span>{new Date(hoveredCheck.timestamp).toLocaleString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
              <span className="text-[#f97356] font-bold">{hoveredCheck.responseTime} ms</span>
              <span className={`px-1.5 py-0.2 rounded text-[10px] ${hoveredCheck.statusCode === 200 ? 'bg-[#132d20] text-[#34d399]' : 'bg-[#381a1f] text-[#ef4444]'}`}>
                HTTP {hoveredCheck.statusCode}
              </span>
            </div>
          )}
        </div>

        {/* Légende sous la barre */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[10px] sm:text-[11px] text-[#716885] mt-2 font-mono">
          <span className="hidden sm:inline">Il y a 30 contrôles</span>
          <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#34d399]" /> Opérationnel
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#fde68a]" /> Ralenti (&gt;{service.degradedThresholdMs || 800}ms)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#ef4444]" /> Hors ligne
            </span>
          </div>
          <span className="hidden sm:inline">Aujourd'hui</span>
        </div>

      </div>

    </div>
  );
}
