#!/usr/bin/env node

/**
 * DevStatus Ping Worker
 * Exécutable via `npm run ping` ou programmé via GitHub Actions cron
 */

import { performance } from 'perf_hooks';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Liste des services par défaut (synchronisée avec le dashboard)
const DEFAULT_SERVICES = [
  {
    id: 'dashboard-devs',
    name: 'Dashboard Devs',
    url: 'https://dashboard-devs-2d9f.vercel.app/',
    category: 'Vercel',
    degradedThresholdMs: 800
  },
  {
    id: 'ma-veille-tech',
    name: 'Ma Veille Tech',
    url: 'https://ma-veille-tech.web.app/',
    category: 'Firebase',
    degradedThresholdMs: 800
  },
  {
    id: 'tab-prospection',
    name: 'Tab Prospection',
    url: 'https://tab-prospection.vercel.app/',
    category: 'Vercel',
    degradedThresholdMs: 800
  },
  {
    id: 'topaze-notes',
    name: 'Topaze Notes',
    url: 'https://topaze-notes.vercel.app/',
    category: 'Vercel',
    degradedThresholdMs: 800
  }
];

const COLORS = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  dim: "\x1b[2m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  cyan: "\x1b[36m",
  blue: "\x1b[34m"
};

async function pingUrl(url, timeoutMs = 10000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  const startTime = performance.now();

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'DevStatus-Monitor/1.0 (+https://github.com/Flowz5/dev-status)',
        'Accept': '*/*'
      },
      signal: controller.signal,
      redirect: 'follow'
    });

    const endTime = performance.now();
    clearTimeout(timeoutId);

    const responseTime = Math.round(endTime - startTime);
    const statusCode = response.status;
    const isOk = statusCode >= 200 && statusCode < 400;

    return {
      success: isOk,
      statusCode,
      responseTime,
      error: null
    };
  } catch (error) {
    clearTimeout(timeoutId);
    const responseTime = Math.round(performance.now() - startTime);
    return {
      success: false,
      statusCode: error.name === 'AbortError' ? 408 : 0,
      responseTime,
      error: error.name === 'AbortError' ? 'Timeout (10s)' : error.message
    };
  }
}

async function runMonitoring() {
  console.log(`\n${COLORS.bright}${COLORS.cyan}======================================================${COLORS.reset}`);
  console.log(`${COLORS.bright} 🚀 DevStatus Monitoring Worker - ${new Date().toLocaleString('fr-FR')}${COLORS.reset}`);
  console.log(`${COLORS.cyan}======================================================${COLORS.reset}\n`);

  const results = [];
  let hasFailure = false;

  for (const service of DEFAULT_SERVICES) {
    process.stdout.write(`Vérification de ${COLORS.bright}${service.name}${COLORS.reset} (${COLORS.dim}${service.url}${COLORS.reset})... `);
    const ping = await pingUrl(service.url);

    let status = 'operational';
    let statusBadge = `${COLORS.green}✔ OPÉRATIONNEL${COLORS.reset}`;

    if (!ping.success) {
      status = 'down';
      statusBadge = `${COLORS.red}✖ HORS LIGNE${COLORS.reset}`;
      hasFailure = true;
    } else if (ping.responseTime > service.degradedThresholdMs) {
      status = 'degraded';
      statusBadge = `${COLORS.yellow}⚠ DÉGRADÉ${COLORS.reset}`;
    }

    const latencyColor = ping.responseTime < 300 ? COLORS.green : (ping.responseTime < 800 ? COLORS.yellow : COLORS.red);

    console.log(`${statusBadge} [HTTP ${ping.statusCode}] en ${latencyColor}${ping.responseTime}ms${COLORS.reset}`);
    if (ping.error) {
      console.log(`   ${COLORS.red}↳ Erreur: ${ping.error}${COLORS.reset}`);
    }

    results.push({
      serviceId: service.id,
      name: service.name,
      url: service.url,
      category: service.category,
      status,
      statusCode: ping.statusCode,
      responseTime: ping.responseTime,
      timestamp: new Date().toISOString(),
      error: ping.error
    });
  }

  // Sauvegarde dans un fichier de cache JSON pour partage ou CI artifacts
  const cachePath = path.resolve(__dirname, '../status-cache.json');
  fs.writeFileSync(cachePath, JSON.stringify({
    lastRun: new Date().toISOString(),
    services: results
  }, null, 2));

  console.log(`\n${COLORS.dim}Rapport exporté dans : ${cachePath}${COLORS.reset}`);
  console.log(`${COLORS.cyan}======================================================${COLORS.reset}\n`);

  if (hasFailure) {
    console.log(`${COLORS.yellow}Attention : Un ou plusieurs services sont indisponibles.${COLORS.reset}`);
  } else {
    console.log(`${COLORS.green}Tous les services sont 100% opérationnels !${COLORS.reset}`);
  }
}

runMonitoring().catch(err => {
  console.error("Erreur critique du worker :", err);
  process.exit(1);
});
