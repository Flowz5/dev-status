import React from 'react';
import { ShieldCheck, AlertCircle, CheckCircle2, Clock } from 'lucide-react';

export function IncidentsTimeline({ services }) {
  const downServices = services.filter(s => s.status === 'down');
  const degradedServices = services.filter(s => s.status === 'degraded');

  return (
    <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 sm:p-6 backdrop-blur-sm shadow-xl">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Journal des Incidents & Statut</h3>
            <p className="text-xs text-slate-400">Suivi des perturbations et résolutions au fil de l'eau</p>
          </div>
        </div>

        <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
          90 derniers jours
        </span>
      </div>

      {downServices.length === 0 && degradedServices.length === 0 ? (
        <div className="py-8 flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-3 shadow-lg shadow-emerald-500/10">
            <CheckCircle2 className="w-6 h-6 animate-pulse" />
          </div>
          <h4 className="text-sm font-semibold text-white">Aucun incident détecté</h4>
          <p className="text-xs text-slate-400 max-w-sm mt-1">
            Tous les systèmes (Firebase, Vercel, API) ont fonctionné avec une disponibilité supérieure à 99.9% au cours de la période.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {downServices.map(s => (
            <div key={s.id} className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-red-200">Incident critique : {s.name}</h4>
                  <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-red-500/20 text-red-300 border border-red-500/40">
                    Hors Ligne
                  </span>
                </div>
                <p className="text-xs text-red-300/80 mt-1">
                  Le service ne répond plus aux requêtes HTTP. Code d'état : {s.statusCode || 'Erreur réseau / Timeout'}.
                </p>
                <div className="flex items-center gap-1.5 text-[11px] text-red-400/70 mt-2 font-mono">
                  <Clock className="w-3 h-3" />
                  <span>Dernier contrôle : {new Date(s.lastCheck).toLocaleTimeString('fr-FR')}</span>
                </div>
              </div>
            </div>
          ))}

          {degradedServices.map(s => (
            <div key={s.id} className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-amber-200">Ralentissement : {s.name}</h4>
                  <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    {s.responseTime} ms
                  </span>
                </div>
                <p className="text-xs text-amber-300/80 mt-1">
                  Le temps de réponse dépasse le seuil nominal fixé ({s.degradedThresholdMs || 800} ms).
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
