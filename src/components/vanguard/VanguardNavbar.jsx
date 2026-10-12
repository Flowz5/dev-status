import React from 'react';
import { RefreshCw, Plus, Settings, Globe, Sliders, LogIn, LogOut, UserCheck } from 'lucide-react';
import { isUserAdmin } from '../../firebase/auth';

export function VanguardNavbar({
  services,
  isRefreshing,
  onRefreshAll,
  onOpenAddModal,
  onOpenSettingsModal,
  isAdminMode,
  setIsAdminMode,
  lastGlobalCheck,
  currentUser,
  onOpenAuthModal,
  onLogout
}) {
  const activeCount = services.filter(s => s.active !== false).length;
  const operationalCount = services.filter(s => s.status === 'operational').length;
  const isAdmin = isUserAdmin(currentUser);

  return (
    <header className="border-b border-[#231d36] bg-[#120f1e]/90 backdrop-blur-md sticky top-0 z-40 px-4 sm:px-6 py-3">
      <div className="max-w-[1700px] mx-auto flex items-center justify-between gap-4">
        
        {/* Logo & Titre */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#f97356] to-[#d94f32] p-1.5 flex items-center justify-center shadow-lg shadow-[#f97356]/20 flex-shrink-0">
            <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-white stroke-current stroke-2">
              <polygon points="12 2 22 20 2 20" fill="currentColor" fillOpacity="0.3" stroke="white" strokeWidth="2" strokeLinejoin="round" />
              <polyline points="12 7 17 17 7 17" fill="white" />
            </svg>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-sm sm:text-base font-extrabold tracking-wider text-white uppercase font-sans">
              DEVSTATUS
            </h1>
            <span className="text-xs text-[#8c829e] hidden md:inline font-mono">
              — MONITORING EN TEMPS RÉEL
            </span>
            <span className="px-2 py-0.5 text-[10px] font-mono font-bold uppercase rounded-md bg-[#2d1b3f] text-[#c084fc] border border-[#4c2d6b]">
              EN DIRECT
            </span>
          </div>
        </div>

        {/* Métriques globales & Contrôles */}
        <div className="flex items-center gap-3 sm:gap-4 flex-wrap sm:flex-nowrap">
          
          {/* Compteur projets */}
          <div className="hidden lg:flex items-center gap-2 text-xs font-mono text-[#948ca5]">
            <span className="text-white font-semibold">{activeCount} Projets</span>
            <span>•</span>
            <span className="text-[#34d399] font-medium">{operationalCount}/{activeCount} Opérationnels</span>
          </div>

          {/* Bouton Tester tout */}
          <button
            onClick={onRefreshAll}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#1f1a30] hover:bg-[#2a2340] text-xs font-mono text-[#e5e1f0] border border-[#2e2646] transition disabled:opacity-50"
            title="Relancer un test sur tous les projets"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#f97356] ${isRefreshing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline font-semibold">
              {isRefreshing ? 'Test en cours...' : 'Tester tout'}
            </span>
          </button>

          {/* Bascule Mode Vue Publique / Gestion */}
          <div className="flex items-center bg-[#171324] p-0.5 rounded-lg border border-[#2a223d]">
            <button
              onClick={() => setIsAdminMode(false)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono transition ${
                !isAdminMode ? 'bg-[#f97356] text-white font-bold shadow-sm' : 'text-[#8c829e] hover:text-white'
              }`}
            >
              <Globe className="w-3 h-3" />
              <span className="hidden sm:inline">Public</span>
            </button>
            <button
              onClick={() => setIsAdminMode(true)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono transition ${
                isAdminMode ? 'bg-[#f97356] text-white font-bold shadow-sm' : 'text-[#8c829e] hover:text-white'
              }`}
            >
              <Sliders className="w-3 h-3" />
              <span className="hidden sm:inline">Gestion</span>
            </button>
          </div>

          {/* Bouton Ajouter URL (si connecté ou admin) */}
          {(isAdminMode || currentUser) && (
            <button
              onClick={onOpenAddModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#f97356] hover:bg-[#ff8469] text-white text-xs font-mono font-bold transition shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Ajouter URL</span>
            </button>
          )}

          {/* Authentification Utilisateur */}
          {currentUser ? (
            <div className="flex items-center gap-2 bg-[#1b162b] border border-[#2e2646] px-2.5 py-1 rounded-xl text-xs font-mono">
              <div className="w-5 h-5 rounded-full bg-[#f97356] flex items-center justify-center text-[10px] font-bold text-white">
                {currentUser.email ? currentUser.email.charAt(0).toUpperCase() : 'U'}
              </div>
              <span className="text-white max-w-[130px] truncate hidden md:inline">
                {currentUser.email}
              </span>
              {isAdmin && (
                <span className="px-1.5 py-0.2 text-[9px] font-bold rounded bg-[#132d20] text-[#34d399] border border-[#1d4c36]">
                  Admin
                </span>
              )}
              <button
                onClick={onLogout}
                className="p-1 rounded text-[#8f85a8] hover:text-[#ef4444] transition ml-1"
                title="Se déconnecter"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuthModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#2b1b22] hover:bg-[#382029] text-[#f97356] border border-[#592631] text-xs font-mono font-bold transition"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Connexion</span>
            </button>
          )}

          {/* Bouton Paramètres */}
          <button
            onClick={onOpenSettingsModal}
            className="p-1.5 rounded-lg bg-[#1c182c] hover:bg-[#25203a] text-[#8c829e] hover:text-white border border-[#2a223d] transition"
            title="Paramètres Firestore & Données"
          >
            <Settings className="w-4 h-4" />
          </button>

        </div>

      </div>
    </header>
  );
}
