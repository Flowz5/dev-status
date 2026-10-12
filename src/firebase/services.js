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
  where,
  orderBy
} from 'firebase/firestore';
import { INITIAL_SERVICES } from '../data/initialServices';

const ADMIN_EMAIL = 'le.dupont.pro@gmail.com';

function getStorageKey(userEmail) {
  return `devstatus_services_data_${userEmail || 'guest'}`;
}

// Récupération initiale ou écoute temps réel des services filtrés par utilisateur
export function subscribeToServices(userEmail, onServicesUpdated) {
  if (!userEmail) {
    onServicesUpdated([]);
    return () => {};
  }

  const isAdmin = userEmail === ADMIN_EMAIL;

  if (db) {
    // Mode Firebase Firestore actif : requête scopée pour respecter les règles de sécurité Firestore
    const servicesRef = collection(db, 'services');
    const q = isAdmin
      ? servicesRef
      : query(servicesRef, where('ownerEmail', '==', userEmail));

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const allServices = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      // Filtrer strictement les services appartenant à l'utilisateur
      let userServices = allServices.filter(s => s.ownerEmail === userEmail);

      // Si c'est l'administrateur principal et qu'il n'a encore aucun service en base, initialiser les 4 projets par défaut
      if (isAdmin && userServices.length === 0 && allServices.filter(s => s.ownerEmail === ADMIN_EMAIL).length === 0) {
        console.log("Initialisation des 4 projets pour l'administrateur dans Firestore...");
        for (const s of INITIAL_SERVICES) {
          const serviceWithOwner = { ...s, ownerEmail: ADMIN_EMAIL };
          await setDoc(doc(db, 'services', s.id), serviceWithOwner);
        }
        return; // onSnapshot se redéclenchera avec les nouveaux documents
      }

      onServicesUpdated(userServices);
    }, (error) => {
      console.error("Erreur d'écoute Firestore :", error);
      // Fallback sur le local storage cloisonné
      fallbackToLocalStorage(userEmail, onServicesUpdated);
    });

    return unsubscribe;
  } else {
    // Mode Stockage Local
    return fallbackToLocalStorage(userEmail, onServicesUpdated);
  }
}

function fallbackToLocalStorage(userEmail, callback) {
  const storageKey = getStorageKey(userEmail);
  const isAdmin = userEmail === ADMIN_EMAIL;
  try {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      callback(JSON.parse(saved));
    } else {
      // Seul l'administrateur reçoit les 4 services par défaut. Tout autre compte démarre à vide.
      const initial = isAdmin ? INITIAL_SERVICES.map(s => ({ ...s, ownerEmail: ADMIN_EMAIL })) : [];
      localStorage.setItem(storageKey, JSON.stringify(initial));
      callback(initial);
    }
  } catch (e) {
    console.error("Erreur de lecture locale :", e);
    callback(isAdmin ? INITIAL_SERVICES : []);
  }

  // Écoute des changements de storage inter-onglets
  const handleStorage = (e) => {
    if (e.key === storageKey && e.newValue) {
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
export async function addService(newService, userEmail) {
  const owner = userEmail || newService.ownerEmail || ADMIN_EMAIL;
  const serviceWithDefaults = {
    ...newService,
    id: newService.id || 'srv-' + Date.now(),
    ownerEmail: owner,
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
    const current = getLocalServices(owner);
    const updated = [...current, serviceWithDefaults];
    saveLocalServices(updated, owner);
  }
  return serviceWithDefaults;
}

// Mettre à jour un service
export async function updateService(id, updates, userEmail) {
  if (db) {
    const ref = doc(db, 'services', id);
    await updateDoc(ref, updates);
  } else {
    const current = getLocalServices(userEmail);
    const updated = current.map(s => s.id === id ? { ...s, ...updates } : s);
    saveLocalServices(updated, userEmail);
  }
}

// Supprimer un service
export async function deleteService(id, userEmail) {
  if (db) {
    await deleteDoc(doc(db, 'services', id));
  } else {
    const current = getLocalServices(userEmail);
    const updated = current.filter(s => s.id !== id);
    saveLocalServices(updated, userEmail);
  }
}

// Helpers LocalStorage partitionnés par compte
export function getLocalServices(userEmail) {
  const storageKey = getStorageKey(userEmail);
  const isAdmin = userEmail === ADMIN_EMAIL;
  try {
    const saved = localStorage.getItem(storageKey);
    if (saved) return JSON.parse(saved);
    return isAdmin ? INITIAL_SERVICES : [];
  } catch {
    return isAdmin ? INITIAL_SERVICES : [];
  }
}

export function saveLocalServices(services, userEmail) {
  const storageKey = getStorageKey(userEmail);
  try {
    localStorage.setItem(storageKey, JSON.stringify(services));
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
