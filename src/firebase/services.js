import { db } from './config';
import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy
} from 'firebase/firestore';
import { INITIAL_SERVICES } from '../data/initialServices';

const LOCAL_STORAGE_KEY = 'devstatus_services_data';
const LOCAL_INCIDENTS_KEY = 'devstatus_incidents_data';

// Récupération initiale ou écoute temps réel des services
export function subscribeToServices(onServicesUpdated) {
  if (db) {
    // Mode Firebase Firestore actif
    const servicesRef = collection(db, 'services');
    const unsubscribe = onSnapshot(servicesRef, async (snapshot) => {
      if (snapshot.empty) {
        // Initialiser avec les 4 services par défaut
        console.log("Initialisation des services par défaut dans Firestore...");
        for (const s of INITIAL_SERVICES) {
          await setDoc(doc(db, 'services', s.id), s);
        }
      } else {
        const services = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        onServicesUpdated(services);
      }
    }, (error) => {
      console.error("Erreur d'écoute Firestore :", error);
      // Fallback sur le local storage
      fallbackToLocalStorage(onServicesUpdated);
    });

    return unsubscribe;
  } else {
    // Mode Stockage Local
    return fallbackToLocalStorage(onServicesUpdated);
  }
}

function fallbackToLocalStorage(callback) {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      callback(parsed);
    } else {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_SERVICES));
      callback(INITIAL_SERVICES);
    }
  } catch (e) {
    console.error("Erreur de lecture locale :", e);
    callback(INITIAL_SERVICES);
  }

  // Écoute des changements de storage inter-onglets
  const handleStorage = (e) => {
    if (e.key === LOCAL_STORAGE_KEY && e.newValue) {
      try {
        callback(JSON.parse(e.newValue));
      } catch (err) {
        console.error(err);
      }
    }
  };
  window.addEventListener('storage', handleStorage);
  return () => window.removeEventListener('storage', handleStorage);
}

// Ajouter un service
export async function addService(newService) {
  const serviceWithDefaults = {
    ...newService,
    id: newService.id || 'srv-' + Date.now(),
    status: 'operational',
    statusCode: 200,
    responseTime: 0,
    lastCheck: new Date().toISOString(),
    uptimePercentage: 100.0,
    active: true,
    degradedThresholdMs: newService.degradedThresholdMs || 800,
    history: []
  };

  if (db) {
    await setDoc(doc(db, 'services', serviceWithDefaults.id), serviceWithDefaults);
  } else {
    const current = getLocalServices();
    const updated = [...current, serviceWithDefaults];
    saveLocalServices(updated);
  }
  return serviceWithDefaults;
}

// Mettre à jour un service
export async function updateService(id, updates) {
  if (db) {
    const ref = doc(db, 'services', id);
    await updateDoc(ref, updates);
  } else {
    const current = getLocalServices();
    const updated = current.map(s => s.id === id ? { ...s, ...updates } : s);
    saveLocalServices(updated);
  }
}

// Supprimer un service
export async function deleteService(id) {
  if (db) {
    await deleteDoc(doc(db, 'services', id));
  } else {
    const current = getLocalServices();
    const updated = current.filter(s => s.id !== id);
    saveLocalServices(updated);
  }
}

// Helpers LocalStorage
export function getLocalServices() {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    return saved ? JSON.parse(saved) : INITIAL_SERVICES;
  } catch {
    return INITIAL_SERVICES;
  }
}

export function saveLocalServices(services) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(services));
    // Déclencher un custom event pour mise à jour immédiate sur la page courante
    window.dispatchEvent(new Event('devstatus_local_update'));
  } catch (e) {
    console.error("Erreur de sauvegarde locale :", e);
  }
}

// Fonction de ping exécutée depuis le client web
export async function pingService(service) {
  const startTime = performance.now();
  let statusCode = 0;
  let status = 'down';
  let responseTime = 0;
  let errorMsg = null;

  try {
    // 1. Essai prioritaire via le proxy de dev Vite /api/ping (sans blocage CORS)
    const proxyUrl = `/api/ping?url=${encodeURIComponent(service.url)}`;
    const res = await fetch(proxyUrl, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      statusCode = data.statusCode || 200;
      responseTime = data.responseTime || Math.round(performance.now() - startTime);
      const isDegraded = responseTime > (service.degradedThresholdMs || 800);
      status = (statusCode >= 200 && statusCode < 400) ? (isDegraded ? 'degraded' : 'operational') : 'down';
      if (data.error) errorMsg = data.error;
    } else {
      throw new Error(`Proxy status: ${res.status}`);
    }
  } catch (proxyErr) {
    // 2. Fallback direct en mode no-cors si le proxy backend n'est pas actif (ex: déploiement statique pur)
    try {
      const directStart = performance.now();
      const directRes = await fetch(service.url, {
        method: 'GET',
        mode: 'no-cors',
        cache: 'no-store'
      });
      const directEnd = performance.now();
      responseTime = Math.round(directEnd - directStart);
      statusCode = directRes.status || 200; // mode no-cors retourne un statut opaque 0, considéré opérationnel si la promesse résout
      const isDegraded = responseTime > (service.degradedThresholdMs || 800);
      status = isDegraded ? 'degraded' : 'operational';
    } catch (directErr) {
      responseTime = Math.round(performance.now() - startTime);
      statusCode = 0;
      status = 'down';
      errorMsg = directErr.message;
    }
  }

  // Calcul du nouvel historique (30 dernières mesures)
  const currentHistory = service.history || [];
  const newPingEntry = {
    timestamp: new Date().toISOString(),
    statusCode,
    responseTime,
    status
  };

  const updatedHistory = [...currentHistory, newPingEntry].slice(-30);

  // Recalcul de l'uptime sur l'historique disponible
  const upCount = updatedHistory.filter(h => h.status === 'operational' || h.status === 'degraded').length;
  const uptimePercentage = updatedHistory.length > 0
    ? Number(((upCount / updatedHistory.length) * 100).toFixed(2))
    : 100.0;

  const updates = {
    statusCode,
    status,
    responseTime,
    lastCheck: new Date().toISOString(),
    history: updatedHistory,
    uptimePercentage,
    lastError: errorMsg
  };

  await updateService(service.id, updates);

  return {
    ...service,
    ...updates
  };
}

// Pinger tous les services
export async function pingAllServices(services, onProgress = () => {}) {
  const results = [];
  for (let i = 0; i < services.length; i++) {
    const s = services[i];
    if (s.active !== false) {
      onProgress(s.name, i + 1, services.length);
      const updated = await pingService(s);
      results.push(updated);
    }
  }
  return results;
}
