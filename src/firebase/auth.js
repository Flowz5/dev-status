import { app } from './config';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';

let auth = null;
if (app) {
  try {
    auth = getAuth(app);
  } catch (err) {
    console.warn("Firebase Auth non initialisé :", err);
  }
}

export const ADMIN_EMAIL = 'le.dupont.pro@gmail.com';

export function isUserAdmin(user) {
  return user && user.email === ADMIN_EMAIL;
}

// Connexion avec Email & Mot de passe
export async function loginWithEmail(email, password) {
  if (!auth) throw new Error("Firebase Auth n'est pas initialisé");
  return await signInWithEmailAndPassword(auth, email, password);
}

// Création de compte Email & Mot de passe
export async function registerWithEmail(email, password) {
  if (!auth) throw new Error("Firebase Auth n'est pas initialisé");
  return await createUserWithEmailAndPassword(auth, email, password);
}

// Connexion en 1 clic avec Google
export async function loginWithGoogle() {
  if (!auth) throw new Error("Firebase Auth n'est pas initialisé");
  const provider = new GoogleAuthProvider();
  return await signInWithPopup(auth, provider);
}

// Déconnexion
export async function logoutUser() {
  if (!auth) return;
  return await signOut(auth);
}

// Écoute de l'état d'authentification
export function subscribeToAuthState(onUserChanged) {
  if (!auth) {
    // Mode local démo : utilisateur invité
    onUserChanged(null);
    return () => {};
  }
  return onAuthStateChanged(auth, (user) => {
    onUserChanged(user);
  });
}

export { auth };
