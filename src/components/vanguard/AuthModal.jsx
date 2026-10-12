import React, { useState } from 'react';
import { X, LogIn, UserPlus, Mail, Lock, AlertCircle } from 'lucide-react';
import { loginWithEmail, registerWithEmail } from '../../firebase/auth';

export function AuthModal({ isOpen, onClose, onAuthSuccess }) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

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
        setError("Cet email est déjà utilisé. Connectez-vous avec vos identifiants.");
      } else if (err.code === 'auth/weak-password') {
        setError("Le mot de passe doit comporter au moins 6 caractères.");
      } else if (err.code === 'auth/configuration-not-found' || err.code === 'auth/operation-not-allowed') {
        setError("L'authentification Email/Mot de passe doit être activée dans la console Firebase (Authentication > Sign-in method).");
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
                {isRegister ? "Créer un compte DevStatus" : "Connexion par Email"}
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

        {/* Formulaire Email / Mot de passe classique (sans Google) */}
        <form onSubmit={handleEmailAuth} className="mt-5 space-y-4 font-mono text-xs">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8f85a8] mb-1.5">
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
                className="w-full bg-[#100d1c] border border-[#251f38] rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-[#5b5270] focus:outline-none focus:border-[#f97356] transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8f85a8] mb-1.5">
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
                className="w-full bg-[#100d1c] border border-[#251f38] rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-[#5b5270] focus:outline-none focus:border-[#f97356] transition"
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
        <div className="mt-5 pt-3 border-t border-[#251f38] text-center font-mono text-[11px] text-[#8f85a8]">
          {isRegister ? (
            <span>
              Vous avez déjà un compte ?{" "}
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
              Première visite ?{" "}
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
