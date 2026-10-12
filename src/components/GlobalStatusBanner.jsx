import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Clock } from 'lucide-react';

export function GlobalStatusBanner({ services, lastGlobalCheck }) {
  const total = services.length;
  const downServices = services.filter(s => s.status === 'down');
  const degradedServices = services.filter(s => s.status === 'degraded');
  
  let statusType = 'operational';
  let title = "Tous les services sont opérationnels";
  let description = "L'ensemble des plateformes Vercel, Firebase et backends répondent nominalement.";
  let Icon = CheckCircle2;
  let bgClass = "bg-gradient-to-r from-emerald-950/40 via-emerald-900/20 to-slate-900 border-emerald-500/30 text-emerald-300";
  let badgeClass = "bg-emerald-500/20 text-emerald-300 border-emerald-500/40";
  let beaconColor = "bg-emerald-400";
  let glowClass = "status-beacon-operational";

  if (downServices.length > 0) {
    statusType = 'down';
    title = downServices.length === 1 
      ? `Incident critique : ${downServices[0].name} est inaccessible`
      : `Panne majeure détectée (${downServices.length} services hors ligne)`;
    description = `Nos vérificateurs ne reçoivent pas de réponse HTTP valide sur ${downServices.map(s => s.name).join(', ')}.`;
    Icon = XCircle;
    bgClass = "bg-gradient-to-r from-red-950/50 via-red-900/30 to-slate-900 border-red-500/40 text-red-300";
    badgeClass = "bg-red-500/20 text-red-300 border-red-500/50";
    beaconColor = "bg-red-500";
    glowClass = "status-beacon-down";
  } else if (degradedServices.length > 0) {
    statusType = 'degraded';
    title = `Performances ralenties (${degradedServices.length} service(s) dégradé(s))`;
    description = `Temps de réponse anormalement élevé constaté sur ${degradedServices.map(s => s.name).join(', ')}.`;
    Icon = AlertTriangle;
    bgClass = "bg-gradient-to-r from-amber-950/50 via-amber-900/30 to-slate-900 border-amber-500/40 text-amber-300";
    badgeClass = "bg-amber-500/20 text-amber-300 border-amber-500/50";
    beaconColor = "bg-amber-400";
    glowClass = "status-beacon-degraded";
  }

  const formattedTime = lastGlobalCheck 
    ? new Date(lastGlobalCheck).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    : 'à l\'instant';

  return (
    <div className={`relative overflow-hidden rounded-2xl border p-5 sm:p-6 shadow-xl backdrop-blur-md ${bgClass} transition-all duration-300`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        
        <div className="flex items-start sm:items-center gap-4">
          <div className="relative mt-1 sm:mt-0 flex-shrink-0">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${badgeClass} ${glowClass}`}>
              <Icon className="w-6 h-6 animate-pulse" />
            </div>
            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${beaconColor}`}></span>
              <span className={`relative inline-flex rounded-full h-3.5 w-3.5 ${beaconColor}`}></span>
            </span>
          </div>

          <div>
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-2">
              {title}
            </h2>
            <p className="text-sm text-slate-300/90 mt-0.5">
              {description}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-400 bg-slate-900/70 px-3.5 py-2 rounded-xl border border-slate-800 self-start sm:self-auto">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>Dernier contrôle : <strong className="text-slate-200">{formattedTime}</strong></span>
        </div>

      </div>
    </div>
  );
}
