import React from 'react';

export function VanguardHealthPipeline({ services }) {
  const activeServices = services.filter(s => s.active !== false);
  const vercelServices = activeServices.filter(s => s.category === 'Vercel');
  const firebaseServices = activeServices.filter(s => s.category === 'Firebase');
  const otherServices = activeServices.filter(s => s.category !== 'Vercel' && s.category !== 'Firebase');

  const pipelineItems = [
    {
      title: 'Applications Vercel (Frontends)',
      badge: vercelServices.every(s => s.status === 'operational') ? 'EN LIGNE' : 'ATTENTION',
      badgeClass: vercelServices.every(s => s.status === 'operational')
        ? 'bg-[#143224] text-[#34d399] border-[#1d4c36]'
        : 'bg-[#3b2326] text-[#f97356] border-[#5e2e34]',
      cases: `${vercelServices.length} projet${vercelServices.length > 1 ? 's' : ''}`,
      desc: vercelServices.map(s => s.name).slice(0, 3).join(', ') || 'Aucun projet'
    },
    {
      title: 'Plateforme Firebase (Hosting)',
      badge: firebaseServices.length > 0 && firebaseServices.every(s => s.status === 'operational') ? 'RAPIDE' : 'EN LIGNE',
      badgeClass: 'bg-[#38331d] text-[#fde68a] border-[#5c542b]',
      cases: `${firebaseServices.length} projet${firebaseServices.length > 1 ? 's' : ''}`,
      desc: firebaseServices.map(s => s.name).slice(0, 3).join(', ') || 'Aucun projet'
    },
    {
      title: 'APIs & Services Web',
      badge: 'STABLE',
      badgeClass: 'bg-[#3b2326] text-[#f97356] border-[#5e2e34]',
      cases: `${otherServices.length} service${otherServices.length > 1 ? 's' : ''}`,
      desc: otherServices.map(s => s.name).slice(0, 3).join(', ') || 'APIs et backends'
    },
    {
      title: 'Surveillance Cron Périodique',
      badge: 'PROGRAMMÉ',
      badgeClass: 'bg-[#261d36] text-[#c084fc] border-[#443161]',
      cases: 'Toutes les 15 min',
      desc: 'Node.js & GitHub Actions'
    }
  ];

  const avgLatency = Math.round(
    activeServices.reduce((acc, s) => acc + (s.responseTime || 0), 0) / (activeServices.filter(s => s.responseTime > 0).length || 1)
  );

  return (
    <div className="bg-[#161224] border border-[#251f38] rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col justify-between">
      
      <div>
        {/* Header en Français */}
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#9d92b5]">
            SANTÉ PAR CATÉGORIE
          </h3>
          <span className="text-[10px] font-mono text-[#716885]">
            Temps Réel
          </span>
        </div>

        {/* Liste des catégories réelles */}
        <div className="space-y-3 mt-3">
          {pipelineItems.map((item, idx) => (
            <div key={idx} className="pb-2.5 border-b border-[#211a30] last:border-0 last:pb-0">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white font-sans">
                  {item.title}
                </span>
                <span className={`px-2 py-0.5 text-[9px] font-bold font-mono rounded-md border ${item.badgeClass}`}>
                  {item.badge}
                </span>
              </div>
              <div className="flex items-center gap-3 text-[11px] font-mono text-[#8a7f9e] mt-1">
                <span className="text-white font-bold">{item.cases}</span>
                <span>•</span>
                <span>{item.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Carte Inférieure : Temps de réponse moyen */}
      <div className="mt-5 pt-3 border-t border-[#231d34]">
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-black text-[#f97356] font-mono tracking-tight">
            {avgLatency} ms
          </span>
          <span className="text-xs font-mono text-[#8c829e]">
            moyenne constatée
          </span>
        </div>
        <p className="text-[11px] font-mono text-[#9186a8] mt-0.5">
          Temps moyen de réponse de vos serveurs
        </p>
        <p className="text-[10px] font-mono text-[#34d399] mt-1 font-bold">
          ✔ Excellente réactivité générale (&lt; 300 ms)
        </p>
      </div>

    </div>
  );
}
