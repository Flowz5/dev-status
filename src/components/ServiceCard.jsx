import React, { useState } from 'react';
import { ExternalLink, RefreshCw, Trash2, Edit3, ArrowUpRight, CheckCircle2, AlertTriangle, XCircle, Clock, Zap } from 'lucide-react';

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

  // Détermination des styles de statut
  const statusConfig = {
    operational: {
      label: 'Opérationnel',
      badgeClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      dotClass: 'bg-emerald-400',
      icon: CheckCircle2,
      borderClass: 'hover:border-emerald-500/30'
    },
    degraded: {
      label: 'Ralenti',
      badgeClass: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      dotClass: 'bg-amber-400',
      icon: AlertTriangle,
      borderClass: 'hover:border-amber-500/30'
    },
    down: {
      label: 'Hors Ligne',
      badgeClass: 'bg-red-500/10 text-red-400 border-red-500/20',
      dotClass: 'bg-red-400',
      icon: XCircle,
      borderClass: 'hover:border-red-500/30'
    }
  };

  const currentStatus = statusConfig[service.status] || statusConfig.operational;
  const StatusIcon = currentStatus.icon;

  // Catégorie badges
  const categoryColors = {
    Vercel: 'bg-black text-slate-100 border-slate-700',
    Firebase: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    'API Backend': 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    Autre: 'bg-slate-800 text-slate-300 border-slate-700'
  };

  const categoryBadge = categoryColors[service.category] || categoryColors.Autre;

  // Historique des 30 dernières vérifications
  const history = service.history || [];
  // Remplir à 30 barres si moins de 30 vérifications
  const paddedHistory = [...Array(Math.max(0, 30 - history.length)).fill(null), ...history].slice(-30);

  // Formattage date dernier check
  const lastCheckText = service.lastCheck 
    ? new Date(service.lastCheck).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    : 'Jamais';

  return (
    <div className={`bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 sm:p-6 backdrop-blur-sm transition-all duration-200 group ${currentStatus.borderClass} shadow-lg shadow-black/20`}>
      
      {/* En-tête de la carte */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-center flex-shrink-0 text-slate-300 group-hover:text-white transition">
            <StatusIcon className={`w-5 h-5 ${service.status === 'operational' ? 'text-emerald-400' : service.status === 'degraded' ? 'text-amber-400' : 'text-red-400'}`} />
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base font-bold text-white tracking-tight">
                {service.name}
              </h3>
              <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${categoryBadge}`}>
                {service.category || 'App'}
              </span>
              <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border flex items-center gap-1.5 ${currentStatus.badgeClass}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${currentStatus.dotClass} animate-pulse`} />
                {currentStatus.label}
              </span>
            </div>

            <div className="flex items-center gap-2 mt-1">
              <a
                href={service.url}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-slate-400 hover:text-indigo-400 transition flex items-center gap-1 truncate max-w-[280px] sm:max-w-md font-mono"
              >
                <span>{service.url}</span>
                <ExternalLink className="w-3 h-3 flex-shrink-0 opacity-70" />
              </a>
            </div>
          </div>
        </div>

        {/* Métriques instantanées (Code HTTP & Latence) */}
        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap sm:flex-nowrap">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs font-mono">
            <span className="text-slate-400">HTTP</span>
            <span className={`font-bold ${service.statusCode >= 200 && service.statusCode < 400 ? 'text-emerald-400' : 'text-red-400'}`}>
              {service.statusCode || 200}
            </span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs font-mono">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span className={`font-bold ${service.responseTime < 300 ? 'text-emerald-400' : service.responseTime < 800 ? 'text-amber-400' : 'text-red-400'}`}>
              {service.responseTime ? `${service.responseTime} ms` : '—'}
            </span>
          </div>

          {/* Bouton Ping individuel */}
          <button
            onClick={handlePing}
            disabled={isPinging}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white border border-slate-700/70 transition disabled:opacity-50"
            title="Tester immédiatement ce service"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isPinging ? 'animate-spin text-emerald-400' : ''}`} />
          </button>

          {/* Actions d'administration */}
          {isAdminMode && (
            <div className="flex items-center gap-1 border-l border-slate-800 pl-2">
              <button
                onClick={() => onEdit(service)}
                className="p-2 rounded-xl bg-slate-800/80 hover:bg-indigo-600/20 text-slate-300 hover:text-indigo-400 border border-slate-700/70 transition"
                title="Modifier"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onDelete(service.id)}
                className="p-2 rounded-xl bg-slate-800/80 hover:bg-red-600/20 text-slate-300 hover:text-red-400 border border-slate-700/70 transition"
                title="Supprimer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

      </div>

      {/* Description du service si présente */}
      {service.description && (
        <p className="text-xs text-slate-400 mb-4 line-clamp-1">
          {service.description}
        </p>
      )}

      {/* Section Uptime Timeline (30 vérifications récentes) */}
      <div className="mt-4 pt-4 border-t border-slate-800/60">
        
        <div className="flex items-center justify-between text-xs mb-2">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-medium">Historique de disponibilité</span>
            <span className="text-emerald-400 font-semibold font-mono">
              {service.uptimePercentage || 99.9}% uptime
            </span>
          </div>

          <div className="flex items-center gap-1 text-[11px] text-slate-500">
            <Clock className="w-3 h-3" />
            <span>Dernier check : {lastCheckText}</span>
          </div>
        </div>

        {/* Barre de 30 segments interactifs */}
        <div className="relative">
          <div className="grid grid-cols-30 gap-1 h-8 sm:h-9 items-end bg-slate-950/40 p-1.5 rounded-xl border border-slate-800/60">
            {paddedHistory.map((item, idx) => {
              if (!item) {
                return (
                  <div
                    key={idx}
                    className="h-full rounded-sm bg-slate-800/40"
                    title="Aucune donnée"
                  />
                );
              }

              let colorClass = 'bg-emerald-500 hover:bg-emerald-400';
              if (item.status === 'down') colorClass = 'bg-red-500 hover:bg-red-400';
              else if (item.status === 'degraded') colorClass = 'bg-amber-500 hover:bg-amber-400';

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

          {/* Tooltip interactif au survol d'une barre */}
          {hoveredCheck && (
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-slate-900 border border-slate-700 text-white text-xs px-3 py-1.5 rounded-lg shadow-xl pointer-events-none flex items-center gap-3 z-20 whitespace-nowrap">
              <span>{new Date(hoveredCheck.timestamp).toLocaleString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
              <span className="font-mono text-emerald-400 font-bold">{hoveredCheck.responseTime} ms</span>
              <span className={`px-1.5 py-0.2 rounded text-[10px] font-mono ${hoveredCheck.statusCode === 200 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'}`}>
                HTTP {hoveredCheck.statusCode}
              </span>
            </div>
          )}
        </div>

        {/* Légende sous la barre */}
        <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2 font-mono">
          <span>Il y a 30 contrôles</span>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" /> Opérationnel
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500" /> Dégradé (&gt;{service.degradedThresholdMs || 800}ms)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500" /> Hors ligne
            </span>
          </div>
          <span>Aujourd'hui</span>
        </div>

      </div>

    </div>
  );
}
