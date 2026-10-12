import React from 'react';
import { Activity, RefreshCw, PlusCircle, Settings, ShieldCheck, Globe, Sliders } from 'lucide-react';

export function Navbar({
  isAdminMode,
  setIsAdminMode,
  onRefreshAll,
  isRefreshing,
  onOpenAddModal,
  onOpenSettingsModal,
  lastGlobalCheck,
  firebaseConnected
}) {
  return (
    <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-xl sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Logo & Titre */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-emerald-400 p-0.5 shadow-lg shadow-indigo-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Activity className="w-5 h-5 text-emerald-400 animate-pulse" />
            </div>
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
                Dev<span className="text-emerald-400 font-extrabold">Status</span>
              </h1>
              <span className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Live
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Monitoring & Disponibilité des Projets d'Équipe
            </p>
          </div>
        </div>

        {/* Actions & Commandes */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Indicateur de synchro Firebase */}
          <button
            onClick={onOpenSettingsModal}
            className={`hidden md:flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-lg border transition-all ${
              firebaseConnected
                ? 'bg-amber-500/10 text-amber-300 border-amber-500/30 hover:bg-amber-500/20'
                : 'bg-slate-800/60 text-slate-400 border-slate-700/60 hover:bg-slate-800'
            }`}
            title="État de la base de données"
          >
            <span className={`w-2 h-2 rounded-full ${firebaseConnected ? 'bg-amber-400' : 'bg-slate-500'}`} />
            <span>{firebaseConnected ? 'Firestore Connecté' : 'Mode Démo / Local'}</span>
          </button>

          {/* Bouton Rafraîchir tout */}
          <button
            onClick={onRefreshAll}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg bg-slate-800 hover:bg-slate-700/80 text-slate-200 border border-slate-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            title="Relancer un ping sur l'ensemble des services"
          >
            <RefreshCw className={`w-4 h-4 text-emerald-400 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">
              {isRefreshing ? 'Vérification...' : 'Vérifier maintenant'}
            </span>
          </button>

          {/* Bascule Mode Public / Administration */}
          <div className="flex items-center bg-slate-800/80 p-0.5 rounded-lg border border-slate-700/80">
            <button
              onClick={() => setIsAdminMode(false)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition ${
                !isAdminMode
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Afficher la vue publique de la page de statut"
            >
              <Globe className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Vue Publique</span>
            </button>
            <button
              onClick={() => setIsAdminMode(true)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition ${
                isAdminMode
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Gérer, ajouter ou modifier les services"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Gestion</span>
            </button>
          </div>

          {/* Bouton Nouveau Service (visible si mode admin ou mobile) */}
          {isAdminMode && (
            <button
              onClick={onOpenAddModal}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20 transition"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Ajouter une URL</span>
            </button>
          )}

          {/* Bouton Paramètres */}
          <button
            onClick={onOpenSettingsModal}
            className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/80 transition"
            title="Paramètres & Configuration Firebase"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>

      </div>
    </header>
  );
}
