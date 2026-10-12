import React from 'react';
import { RefreshCw, Plus, Settings, LogOut } from 'lucide-react';
import { isUserAdmin } from '../../firebase/auth';

export function VanguardNavbar({
  services,
  isRefreshing,
  onRefreshAll,
  onOpenAddModal,
  onOpenSettingsModal,
  currentUser,
  onLogout
}) {
  const activeCount = services.filter(s => s.active !== false).length;
  const operationalCount = services.filter(s => s.status === 'operational').length;
  const isAdmin = isUserAdmin(currentUser);

  return (
    <header className="border-b border-[#231d36] bg-[#120f1e]/90 backdrop-blur-md sticky top-0 z-40 px-3 sm:px-6 py-2.5 sm:py-3">
      <div className="max-w-[1700px] mx-auto flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Logo & Titre */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-[#f97356] to-[#d94f32] p-1.5 flex items-center justify-center shadow-lg shadow-[#f97356]/20 flex-shrink-0">
            <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 sm:w-5 sm:h-5 text-white stroke-current stroke-2">
              <polygon points="12 2 22 20 2 20" fill="currentColor" fillOpacity="0.3" stroke="white" strokeWidth="2" strokeLinejoin="round" />
              <polyline points="12 7 17 17 7 17" fill="white" />
            </svg>
          </div>

          <div className="flex items-center gap-2">
            <h1 className="text-xs sm:text-base font-extrabold tracking-wider text-white uppercase font-sans">
              DEVSTATUS
            </h1>
            <span className="text-xs text-[#8c829e] hidden lg:inline font-mono">
              — MONITORING EN TEMPS RÉEL
            </span>
            <span className="hidden sm:inline px-2 py-0.5 text-[10px] font-mono font-bold uppercase rounded-md bg-[#2d1b3f] text-[#c084fc] border border-[#4c2d6b]">
              EN DIRECT
            </span>
          </div>
        </div>

        {/* Métriques globales & Contrôles */}
        <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
          
          {/* Compteur projets */}
          <div className="hidden xl:flex items-center gap-2 text-xs font-mono text-[#948ca5]">
            <span className="text-white font-semibold">{activeCount} Projets</span>
            <span>•</span>
            <span className="text-[#34d399] font-medium">{operationalCount}/{activeCount} Opérationnels</span>
          </div>

          {/* Bouton Tester tout */}
          {activeCount > 0 && (
            <button
              onClick={onRefreshAll}
              disabled={isRefreshing}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-[#1f1a30] hover:bg-[#2a2340] text-xs font-mono text-[#e5e1f0] border border-[#2e2646] transition disabled:opacity-50 cursor-pointer"
              title="Relancer un test sur tous les projets"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#f97356] ${isRefreshing ? 'animate-spin' : ''}`} />
              <span className="hidden md:inline font-semibold">
                {isRefreshing ? 'Test...' : 'Tester tout'}
              </span>
            </button>
          )}

          {/* Bouton Ajouter URL */}
          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-[#f97356] hover:bg-[#ff8469] text-white text-xs font-mono font-bold transition shadow-sm cursor-pointer"
            title="Ajouter une nouvelle URL"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Ajouter URL</span>
          </button>

          {/* Badge Utilisateur Connecté & Déconnexion */}
          {currentUser && (
            <div className="flex items-center gap-1.5 sm:gap-2 bg-[#1b162b] border border-[#2e2646] px-2 sm:px-2.5 py-1.5 rounded-xl text-xs font-mono">
              <div className="w-5 h-5 rounded-full bg-[#f97356] flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0">
                {currentUser.email ? currentUser.email.charAt(0).toUpperCase() : 'U'}
              </div>
              <span className="text-white max-w-[120px] truncate hidden md:inline text-[11px]">
                {currentUser.email}
              </span>
              {isAdmin && (
                <span className="hidden sm:inline px-1.5 py-0.2 text-[9px] font-bold rounded bg-[#132d20] text-[#34d399] border border-[#1d4c36]">
                  Admin
                </span>
              )}
              <button
                onClick={onLogout}
                className="p-1 rounded text-[#8f85a8] hover:text-[#ef4444] hover:bg-[#281b29] transition cursor-pointer"
                title="Se déconnecter"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Bouton Paramètres */}
          <button
            onClick={onOpenSettingsModal}
            className="p-1.5 sm:p-2 rounded-lg bg-[#1c182c] hover:bg-[#25203a] text-[#8c829e] hover:text-white border border-[#2a223d] transition cursor-pointer"
            title="Paramètres Firestore & Données"
          >
            <Settings className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>

        </div>

      </div>
    </header>
  );
}
