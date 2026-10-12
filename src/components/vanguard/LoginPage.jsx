import React, { useState } from 'react';
import { Activity, LogIn, UserPlus, Mail, Lock, AlertCircle, ShieldCheck, Zap, BarChart3, CheckCircle2 } from 'lucide-react';
import { loginWithEmail, registerWithEmail } from '../../firebase/auth';

export function LoginPage({ onAuthSuccess }) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
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
      if (onAuthSuccess) {
        onAuthSuccess(result.user);
      }
    } catch (err) {
      console.error("Erreur d'authentification :", err);
      if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError("Identifiants incorrects. Vérifiez votre adresse email et votre mot de passe.");
      } else if (err.code === 'auth/user-not-found') {
        setError("Aucun compte trouvé avec cet email. Vous pouvez en créer un ci-dessous.");
      } else if (err.code === 'auth/email-already-in-use') {
        setError("Cet email est déjà utilisé. Connectez-vous avec vos identifiants existants.");
      } else if (err.code === 'auth/weak-password') {
        setError("Le mot de passe doit comporter au moins 6 caractères.");
      } else if (err.code === 'auth/configuration-not-found' || err.code === 'auth/operation-not-allowed') {
        setError("L'authentification Email/Mot de passe doit être activée dans la console Firebase (Authentication > Sign-in method).");
      } else {
        setError("Erreur : " + (err.message || "Impossible de se connecter"));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0e0c16] text-[#e6e2f0] flex flex-col justify-between relative overflow-hidden font-sans selection:bg-[#f97356] selection:text-white">
      
      {/* Halos lumineux en arrière-plan */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[#f97356]/10 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[550px] h-[550px] rounded-full bg-[#7c3aed]/10 blur-[150px] pointer-events-none" />

      {/* Barre supérieure minimale */}
      <header className="relative z-10 max-w-7xl w-full mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#f97356] to-[#d94f32] p-2 flex items-center justify-center shadow-lg shadow-[#f97356]/20">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-black text-lg tracking-wider text-white">DEVSTATUS</span>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-[#251f38] text-[#f97356] border border-[#3b3254]">
                Espace Sécurisé
              </span>
            </div>
            <p className="text-[11px] font-mono text-[#8a7f9e]">Supervision de vos projets d'équipe en temps réel</p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-[#716885]">
          <ShieldCheck className="w-4 h-4 text-[#34d399]" />
          <span>Accès privé par compte</span>
        </div>
      </header>

      {/* Contenu Central : Card de Connexion */}
      <main className="relative z-10 max-w-5xl w-full mx-auto px-6 py-8 flex flex-col lg:flex-row items-center gap-12 justify-center flex-1">
        
        {/* Colonne Gauche : Présentation du Dashboard Privé */}
        <div className="w-full lg:w-1/2 space-y-6 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1b152d] border border-[#2e244d] text-xs font-mono text-[#fde68a]">
            <Zap className="w-3.5 h-3.5 text-[#f97356]" />
            <span>Chaque compte possède son propre espace</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight font-sans">
            Surveillez la santé de <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f97356] to-[#fde68a]">vos projets</span> en continu.
          </h1>

          <p className="text-sm text-[#9e94b5] leading-relaxed">
            Connectez-vous pour accéder à votre tableau de bord dédié. Vous pourrez enregistrer vos propres URLs d'applications et d'APIs, suivre les temps de réponse en millisecondes et visualiser vos historiques de disponibilité.
          </p>

          <div className="space-y-3 pt-2 font-mono text-xs text-[#c2bad3]">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-4 h-4 text-[#34d399] flex-shrink-0" />
              <span>Tableau de bord privé et cloisonné par utilisateur</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-4 h-4 text-[#34d399] flex-shrink-0" />
              <span>Sonde périodique avec temps de réponse en ms & HTTP 200</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-4 h-4 text-[#34d399] flex-shrink-0" />
              <span>Courbes de tendance, score de santé et alertes</span>
            </div>
          </div>
        </div>

        {/* Colonne Droite : Formulaire d'authentification */}
        <div className="w-full lg:w-[420px]">
          <div className="bg-[#161224] border border-[#251f38] rounded-3xl p-7 shadow-2xl relative backdrop-blur-sm">
            
            <div className="text-left mb-6">
              <h2 className="text-xl font-bold text-white font-sans">
                {isRegister ? "Créer votre espace" : "Connexion"}
              </h2>
              <p className="text-xs font-mono text-[#8a7f9e] mt-1">
                {isRegister
                  ? "Créez votre compte pour monitorer vos premiers sites"
                  : "Accédez à votre tableau de bord personnel"}
              </p>
            </div>

            {/* Alerte d'erreur */}
            {error && (
              <div className="mb-5 p-3.5 rounded-xl bg-[#381a1f] border border-[#59222c] text-[#ef4444] text-xs font-mono flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span className="leading-snug">{error}</span>
              </div>
            )}

            {/* Formulaire */}
            <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs text-left">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#9d92b5] mb-1.5">
                  Adresse Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#5b5270] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="vous@exemple.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#100d1c] border border-[#251f38] rounded-xl pl-10 pr-3.5 py-3 text-xs text-white placeholder-[#5b5270] focus:outline-none focus:border-[#f97356] transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#9d92b5] mb-1.5">
                  Mot de passe
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#5b5270] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#100d1c] border border-[#251f38] rounded-xl pl-10 pr-3.5 py-3 text-xs text-white placeholder-[#5b5270] focus:outline-none focus:border-[#f97356] transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-3 rounded-xl font-bold bg-[#f97356] hover:bg-[#ff8469] text-white transition disabled:opacity-50 shadow-lg shadow-[#f97356]/20 flex items-center justify-center gap-2 cursor-pointer text-sm"
              >
                {isLoading ? (
                  <span>Vérification...</span>
                ) : isRegister ? (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span>Créer mon compte</span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    <span>Se connecter au Dashboard</span>
                  </>
                )}
              </button>
            </form>

            {/* Bascule Connexion / Inscription */}
            <div className="mt-6 pt-4 border-t border-[#251f38] text-center font-mono text-xs text-[#8a7f9e]">
              {isRegister ? (
                <span>
                  Vous avez déjà un compte ?{" "}
                  <button
                    type="button"
                    onClick={() => { setIsRegister(false); setError(null); }}
                    className="text-[#f97356] hover:underline font-bold ml-1 cursor-pointer"
                  >
                    Se connecter
                  </button>
                </span>
              ) : (
                <span>
                  Nouveau sur DevStatus ?{" "}
                  <button
                    type="button"
                    onClick={() => { setIsRegister(true); setError(null); }}
                    className="text-[#f97356] hover:underline font-bold ml-1 cursor-pointer"
                  >
                    Créer un compte
                  </button>
                </span>
              )}
            </div>

          </div>
        </div>

      </main>

      {/* Footer minimaliste */}
      <footer className="relative z-10 py-5 text-center font-mono text-[11px] text-[#5b5270] border-t border-[#1a1529]">
        DevStatus © 2026 — Surveillance haute disponibilité en temps réel
      </footer>

    </div>
  );
}
