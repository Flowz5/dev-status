import React, { useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from 'recharts';
import { Activity, Clock } from 'lucide-react';

const SERVICE_COLORS = [
  '#10b981', // Emerald
  '#6366f1', // Indigo
  '#f59e0b', // Amber
  '#06b6d4', // Cyan
  '#ec4899', // Pink
  '#8b5cf6'  // Purple
];

export function HistoryChart({ services }) {
  const activeServices = services.filter(s => s.active !== false);

  // Préparation des données chronologiques pour le graphique
  // On prend les 15 à 30 derniers points
  const pointsCount = 15;
  const chartData = [];

  for (let i = pointsCount - 1; i >= 0; i--) {
    const dataPoint = {};
    let pointTime = null;

    activeServices.forEach((service) => {
      const history = service.history || [];
      const item = history[history.length - 1 - i];
      if (item) {
        dataPoint[service.name] = item.responseTime;
        if (!pointTime) {
          const date = new Date(item.timestamp);
          pointTime = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
        }
      } else {
        dataPoint[service.name] = service.responseTime || null;
      }
    });

    dataPoint.time = pointTime || `T-${i * 15}m`;
    chartData.push(dataPoint);
  }

  return (
    <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 sm:p-6 backdrop-blur-sm shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">
              Graphique d'Historique de Latence (ms)
            </h3>
            <p className="text-xs text-slate-400">
              Évolution du temps de réponse lors des derniers contrôles de disponibilité
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-400 bg-slate-950/60 px-3 py-1.5 rounded-xl border border-slate-800 self-start sm:self-auto">
          <Clock className="w-3.5 h-3.5 text-indigo-400" />
          <span>Intervalle moyen : 15 min</span>
        </div>
      </div>

      <div className="h-64 sm:h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.6} />
            <XAxis 
              dataKey="time" 
              stroke="#64748b" 
              fontSize={11} 
              tickLine={false} 
              fontFamily="monospace"
            />
            <YAxis 
              stroke="#64748b" 
              fontSize={11} 
              tickLine={false} 
              fontFamily="monospace"
              unit="ms" 
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0f172a',
                borderColor: '#334155',
                borderRadius: '0.75rem',
                fontSize: '12px',
                color: '#fff',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)'
              }}
              formatter={(value, name) => [`${value} ms`, name]}
              labelFormatter={(label) => `Contrôle à ${label}`}
            />
            <Legend 
              wrapperStyle={{ paddingTop: '15px', fontSize: '12px' }} 
              iconType="circle"
            />
            {activeServices.map((service, index) => (
              <Line
                key={service.id}
                type="monotone"
                dataKey={service.name}
                stroke={SERVICE_COLORS[index % SERVICE_COLORS.length]}
                strokeWidth={2}
                dot={{ r: 3, fill: SERVICE_COLORS[index % SERVICE_COLORS.length] }}
                activeDot={{ r: 6 }}
                connectNulls
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
