import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Vérification de la présence de la configuration Firebase dans l'environnement ou le localStorage
export function getFirebaseConfig() {
  const envConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
  };

  if (envConfig.apiKey && envConfig.projectId) {
    return { config: envConfig, source: 'env' };
  }

  // Vérification si l'utilisateur a configuré Firebase via le modal de paramètres dans l'app
  try {
    const savedConfig = localStorage.getItem('devstatus_firebase_config');
    if (savedConfig) {
      const parsed = JSON.parse(savedConfig);
      if (parsed.apiKey && parsed.projectId) {
        return { config: parsed, source: 'localStorage' };
      }
    }
  } catch (e) {
    console.warn("Erreur lors de la lecture de la config Firebase locale :", e);
  }

  return { config: null, source: 'none' };
}

let app = null;
let db = null;

const { config } = getFirebaseConfig();

if (config) {
  try {
    app = getApps().length === 0 ? initializeApp(config) : getApps()[0];
    db = getFirestore(app);
    console.log("🔥 Firebase Firestore connecté avec succès");
  } catch (err) {
    console.warn("⚠️ Impossible d'initialiser Firebase :", err);
  }
} else {
  console.log("ℹ️ Mode Local / Démo actif (aucune clé Firebase détectée, persistance locale active)");
}

export { app, db };
