import React from 'react';
import { ShieldCheck, Zap, Server, Activity } from 'lucide-react';

export function MetricCards({ services }) {
  const activeServices = services.filter(s => s.active !== false);
  const total = activeServices.length;

  // Calcul du taux d'uptime moyen
  const avgUptime = total > 0
    ? (activeServices.reduce((acc, s) => acc + (s.uptimePercentage || 100), 0) / total).toFixed(2)
    : '100.00';

  // Calcul du temps de réponse moyen
  const validLatencies = activeServices.filter(s => s.responseTime > 0);
  const avgLatency = validLatencies.length > 0
    ? Math.round(validLatencies.reduce((acc, s) => acc + s.responseTime, 0) / validLatencies.length)
    : 0;

  // Comptage des services opérationnels
  const operationalCount = activeServices.filter(s => s.status === 'operational').length;
  const operationalPercent = total > 0 ? Math.round((operationalCount / total) * 100) : 100;

  // Latence couleur
  const latencyBadgeColor = avgLatency < 200 
    ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' 
    : (avgLatency < 500 ? 'text-amber-400 bg-amber-500/10 border-amber-500/20' : 'text-red-400 bg-red-500/10 border-red-500/20');

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      
      {/* 1. Disponibilité Globale */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-sm relative overflow-hidden group hover:border-slate-700 transition">
        <div className="flex items-center justify-between text-slate-400 mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider">Disponibilité Globale</span>
          <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <ShieldCheck className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-extrabold tracking-tight text-white font-mono">
            {avgUptime}%
          </span>
          <span className="text-xs font-medium text-emerald-400">
            30 derniers jours
          </span>
        </div>
        <p className="text-xs text-slate-500 mt-2">
          SLA contractuel garanti : 99.9%
        </p>
      </div>

      {/* 2. Temps de Réponse Moyen */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-sm relative overflow-hidden group hover:border-slate-700 transition">
        <div className="flex items-center justify-between text-slate-400 mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider">Temps de Réponse Moyen</span>
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Zap className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-extrabold tracking-tight text-white font-mono">
            {avgLatency}
          </span>
          <span className="text-sm text-slate-400 font-mono">ms</span>
          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${latencyBadgeColor}`}>
            {avgLatency < 200 ? 'Ultra Rapide' : (avgLatency < 500 ? 'Nominal' : 'Lent')}
          </span>
        </div>
        <p className="text-xs text-slate-500 mt-2">
          Moyenne observée sur l'ensemble des apps
        </p>
      </div>

      {/* 3. Services Opérationnels */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-sm relative overflow-hidden group hover:border-slate-700 transition">
        <div className="flex items-center justify-between text-slate-400 mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider">Services Opérationnels</span>
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Server className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-extrabold tracking-tight text-white font-mono">
            {operationalCount} <span className="text-slate-500 text-xl font-normal">/ {total}</span>
          </span>
          <span className="text-xs font-medium text-slate-400">
            ({operationalPercent}%)
          </span>
        </div>
        
        {/* Barre de progression */}
        <div className="w-full bg-slate-800 rounded-full h-1.5 mt-3 overflow-hidden">
          <div 
            className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500" 
            style={{ width: `${operationalPercent}%` }}
          />
        </div>
      </div>

      {/* 4. Fréquence & Couverture */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-sm relative overflow-hidden group hover:border-slate-700 transition">
        <div className="flex items-center justify-between text-slate-400 mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider">Intervalle de Ping</span>
          <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <Activity className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-extrabold tracking-tight text-white font-mono">
            15 min
          </span>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20">
            GitHub Actions
          </span>
        </div>
        <p className="text-xs text-slate-500 mt-2">
          Contrôles continus 24h/24 via cron & instantané
        </p>
      </div>

    </div>
  );
}
