import React, { useState } from 'react';
import { X, LogIn, UserPlus, Mail, Lock, AlertCircle, CheckCircle2 } from 'lucide-react';
import { loginWithEmail, registerWithEmail, loginWithGoogle } from '../../firebase/auth';

export function AuthModal({ isOpen, onClose, onAuthSuccess }) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await loginWithGoogle();
      onAuthSuccess(result.user);
      onClose();
    } catch (err) {
      console.error(err);
      setError(err.message.includes('popup-closed-by-user')
        ? "Connexion Google annulée."
        : "Erreur lors de la connexion Google : " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Veuillez renseigner votre email et mot de passe.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      let result;
      if (isRegister) {
        result = await registerWithEmail(email, password);
      } else {
        result = await loginWithEmail(email, password);
      }
      onAuthSuccess(result.user);
      onClose();
    } catch (err) {
      console.error(err);
      if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError("Identifiants incorrects. Vérifiez votre mot de passe.");
      } else if (err.code === 'auth/user-not-found') {
        setError("Aucun compte trouvé avec cet email. Créez un compte ci-dessous.");
      } else if (err.code === 'auth/email-already-in-use') {
        setError("Cet email est déjà utilisé. Connectez-vous plutôt.");
      } else if (err.code === 'auth/weak-password') {
        setError("Le mot de passe doit comporter au moins 6 caractères.");
      } else {
        setError("Erreur : " + err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#161224] border border-[#251f38] rounded-2xl w-full max-w-md p-6 shadow-2xl relative font-sans text-[#e6e2f0]">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#251f38]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#f97356] to-[#d94f32] p-1.5 flex items-center justify-center shadow-lg shadow-[#f97356]/20">
              <LogIn className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-sans">
                {isRegister ? "Créer un compte DevStatus" : "Connexion à votre Espace"}
              </h3>
              <p className="text-xs text-[#8f85a8] font-mono">
                Gérez et surveillez vos propres sites
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#8f85a8] hover:text-white hover:bg-[#1f1a30] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message d'erreur */}
        {error && (
          <div className="mt-4 p-3 rounded-xl bg-[#381a1f] border border-[#59222c] text-[#ef4444] text-xs font-mono flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Bouton Google (1 clic) */}
        <div className="mt-5">
          <button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-xl bg-[#1f1a30] hover:bg-[#28223e] border border-[#2e2646] text-xs font-mono font-bold text-white transition disabled:opacity-50 shadow-sm"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>Continuer avec Google</span>
          </button>
        </div>

        {/* Séparateur */}
        <div className="flex items-center gap-3 my-4">
          <div className="flex-1 h-px bg-[#251f38]" />
          <span className="text-[10px] font-mono text-[#716885] uppercase">ou par email</span>
          <div className="flex-1 h-px bg-[#251f38]" />
        </div>

        {/* Formulaire Email / Mot de passe */}
        <form onSubmit={handleEmailAuth} className="space-y-3 font-mono text-xs">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8f85a8] mb-1">
              Adresse Email
            </label>
            <div className="relative">
              <Mail className="w-3.5 h-3.5 text-[#5b5270] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="le.dupont.pro@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#100d1c] border border-[#251f38] rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-[#5b5270] focus:outline-none focus:border-[#f97356] transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8f85a8] mb-1">
              Mot de passe
            </label>
            <div className="relative">
              <Lock className="w-3.5 h-3.5 text-[#5b5270] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#100d1c] border border-[#251f38] rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-[#5b5270] focus:outline-none focus:border-[#f97356] transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-2.5 rounded-xl font-bold bg-[#f97356] hover:bg-[#ff8469] text-white transition disabled:opacity-50 shadow-md shadow-[#f97356]/20 flex items-center justify-center gap-2"
          >
            {isRegister ? <UserPlus className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
            <span>{isLoading ? "Chargement..." : isRegister ? "Créer mon compte" : "Se connecter"}</span>
          </button>
        </form>

        {/* Bascule Connexion / Inscription */}
        <div className="mt-4 pt-3 border-t border-[#251f38] text-center font-mono text-[11px] text-[#8f85a8]">
          {isRegister ? (
            <span>
              Déjà un compte ?{" "}
              <button
                type="button"
                onClick={() => { setIsRegister(false); setError(null); }}
                className="text-[#f97356] hover:underline font-bold"
              >
                Se connecter
              </button>
            </span>
          ) : (
            <span>
              Pas encore de compte ?{" "}
              <button
                type="button"
                onClick={() => { setIsRegister(true); setError(null); }}
                className="text-[#f97356] hover:underline font-bold"
              >
                Créer un compte
              </button>
            </span>
          )}
        </div>

      </div>
    </div>
  );
}
