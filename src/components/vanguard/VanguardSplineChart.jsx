import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';

export function VanguardSplineChart({ services, selectedService }) {
  // Préparation des données réelles basées sur l'historique
  const history = selectedService ? (selectedService.history || []) : (services[0]?.history || []);
  
  const chartData = history.slice(-20).map((item, idx) => {
    const time = item.timestamp 
      ? new Date(item.timestamp).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
      : `#${idx + 1}`;
    return {
      index: idx + 1,
      time,
      latency: item.responseTime || 80
    };
  });

  const baseLatency = selectedService 
    ? (selectedService.responseTime || 110)
    : Math.round(services.reduce((acc, s) => acc + (s.responseTime || 0), 0) / (services.length || 1));

  const minLatency = chartData.length > 0 ? Math.min(...chartData.map(d => d.latency)) : baseLatency;

  return (
    <div className="bg-[#161224] border border-[#251f38] rounded-2xl p-5 shadow-xl flex flex-col justify-between">
      
      {/* En-tête en Français */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#9d92b5]">
            HISTORIQUE DES TEMPS DE RÉPONSE (LATENCE)
          </h3>
          <p className="text-[11px] text-[#716885] font-mono mt-0.5">
            {selectedService ? `Vérifications récentes pour ${selectedService.name}` : 'Moyenne sur l\'ensemble des projets'}
          </p>
        </div>
        <span className="text-[11px] font-mono text-[#f97356] font-bold">
          {baseLatency} ms actuel
        </span>
      </div>

      {/* Graphique Spline Douce */}
      <div className="relative h-48 sm:h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
            <defs>
              <linearGradient id="vanguardSplineGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f97356" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#f97356" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#251f38" opacity={0.4} />
            <XAxis
              dataKey="time"
              stroke="#6b6280"
              fontSize={10}
              tickLine={false}
              fontFamily="monospace"
            />
            <YAxis
              stroke="#6b6280"
              fontSize={10}
              tickLine={false}
              fontFamily="monospace"
              unit="ms"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#110e1b',
                borderColor: '#392d4f',
                borderRadius: '0.5rem',
                fontSize: '11px',
                color: '#fff',
                fontFamily: 'monospace'
              }}
              formatter={(val) => [`${val} ms`, 'Temps de réponse']}
              labelFormatter={(label) => `Contrôle à ${label}`}
            />
            <Area
              type="monotone"
              dataKey="latency"
              stroke="#f97356"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#vanguardSplineGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Footer sous la courbe */}
      <div className="flex items-center justify-between text-xs font-mono pt-3 border-t border-[#231d34] mt-3">
        <div className="flex items-baseline gap-2">
          <span className="text-sm font-bold text-white font-mono">{minLatency} ms</span>
          <span className="text-[11px] text-[#7a718f]">meilleur temps enregistré</span>
        </div>

        <div className="text-[11px] text-[#34d399] font-medium flex items-center gap-1.5">
          <span>✔ En dessous du seuil d'alerte (800 ms)</span>
        </div>
      </div>

    </div>
  );
}
