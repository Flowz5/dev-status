// Données initiales des services de l'équipe
export const INITIAL_SERVICES = [
  {
    id: 'dashboard-devs',
    name: 'Dashboard Devs',
    url: 'https://dashboard-devs-2d9f.vercel.app/',
    category: 'Vercel',
    tags: ['Frontend', 'Vercel', 'Production'],
    status: 'operational', // 'operational' | 'degraded' | 'down'
    statusCode: 200,
    responseTime: 95,
    lastCheck: new Date().toISOString(),
    uptimePercentage: 99.98,
    active: true,
    degradedThresholdMs: 800,
    description: "Portail principal et dashboard des développeurs de l'équipe",
    history: generateMockHistory(95, 200)
  },
  {
    id: 'ma-veille-tech',
    name: 'Ma Veille Tech',
    url: 'https://ma-veille-tech.web.app/',
    category: 'Firebase',
    tags: ['Firebase', 'Hosting', 'Production'],
    status: 'operational',
    statusCode: 200,
    responseTime: 110,
    lastCheck: new Date().toISOString(),
    uptimePercentage: 100.0,
    active: true,
    degradedThresholdMs: 800,
    description: "Application de curation et partage de veille technologique",
    history: generateMockHistory(110, 200)
  },
  {
    id: 'tab-prospection',
    name: 'Tab Prospection',
    url: 'https://tab-prospection.vercel.app/',
    category: 'Vercel',
    tags: ['Outil Interne', 'Vercel', 'Lead Gen'],
    status: 'operational',
    statusCode: 200,
    responseTime: 130,
    lastCheck: new Date().toISOString(),
    uptimePercentage: 99.85,
    active: true,
    degradedThresholdMs: 800,
    description: "Outil de prospection et gestion des opportunités commerciales",
    history: generateMockHistory(130, 200)
  },
  {
    id: 'topaze-notes',
    name: 'Topaze Notes',
    url: 'https://topaze-notes.vercel.app/',
    category: 'Vercel',
    tags: ['Web App', 'Vercel', 'Notes'],
    status: 'operational',
    statusCode: 200,
    responseTime: 105,
    lastCheck: new Date().toISOString(),
    uptimePercentage: 100.0,
    active: true,
    degradedThresholdMs: 800,
    description: "Prise de notes collaborative et gestion de connaissances",
    history: generateMockHistory(105, 200)
  }
];

// Génère un historique réaliste de 30 vérifications récentes pour initialiser les barres de statut
function generateMockHistory(baseLatency, baseStatus) {
  const history = [];
  const now = Date.now();
  for (let i = 29; i >= 0; i--) {
    const timestamp = new Date(now - i * 15 * 60 * 1000).toISOString();
    // Variation naturelle de latence (+/- 25%)
    const variation = Math.floor((Math.random() - 0.5) * (baseLatency * 0.4));
    const latency = Math.max(20, baseLatency + variation);
    history.push({
      timestamp,
      statusCode: baseStatus,
      responseTime: latency,
      status: latency > 800 ? 'degraded' : 'operational'
    });
  }
  return history;
}
