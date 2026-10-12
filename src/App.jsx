import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { GlobalStatusBanner } from './components/GlobalStatusBanner';
import { MetricCards } from './components/MetricCards';
import { ServiceCard } from './components/ServiceCard';
import { HistoryChart } from './components/HistoryChart';
import { IncidentsTimeline } from './components/IncidentsTimeline';
import { AddServiceModal } from './components/AddServiceModal';
import { EditServiceModal } from './components/EditServiceModal';
import { SettingsModal } from './components/SettingsModal';
import {
  subscribeToServices,
  addService,
  updateService,
  deleteService,
  pingService,
  pingAllServices,
  saveLocalServices
} from './firebase/services';
import { db } from './firebase/config';
import { INITIAL_SERVICES } from './data/initialServices';
import { Search, Filter, Layers, Github, Heart, RefreshCw, Plus } from 'lucide-react';

export default function App() {
  const [services, setServices] = useState([]);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshProgress, setRefreshProgress] = useState(null);
  const [lastGlobalCheck, setLastGlobalCheck] = useState(() => new Date().toISOString());
  
  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);

  // Filtres
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  // Souscription aux services (Firestore ou Local)
  useEffect(() => {
    const unsubscribe = subscribeToServices((data) => {
      setServices(data || []);
    });
    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  // Rafraîchissement global de tous les services
  const handleRefreshAll = useCallback(async () => {
    if (isRefreshing || services.length === 0) return;
    setIsRefreshing(true);
    try {
      await pingAllServices(services, (name, current, total) => {
        setRefreshProgress(`Vérification de ${name} (${current}/${total})...`);
      });
      setLastGlobalCheck(new Date().toISOString());
    } catch (err) {
      console.error("Erreur lors du rafraîchissement global :", err);
    } finally {
      setIsRefreshing(false);
      setRefreshProgress(null);
    }
  }, [isRefreshing, services]);

  // Ping individuel d'un service
  const handlePingSingle = async (service) => {
    await pingService(service);
    setLastGlobalCheck(new Date().toISOString());
  };

  // Ajout de service
  const handleAddService = async (serviceData) => {
    await addService(serviceData);
  };

  // Mise à jour de service
  const handleUpdateService = async (id, updates) => {
    await updateService(id, updates);
  };

  // Suppression de service
  const handleDeleteService = async (id) => {
    await deleteService(id);
  };

  // Réinitialisation aux 4 services originaux
  const handleResetServices = () => {
    saveLocalServices(INITIAL_SERVICES);
    setServices(INITIAL_SERVICES);
  };

  // Filtrage des services
  const categories = ['ALL', 'Vercel', 'Firebase', 'API Backend'];
  const filteredServices = services.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.url.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'ALL' || s.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      
      {/* Barre de navigation */}
      <Navbar
        isAdminMode={isAdminMode}
        setIsAdminMode={setIsAdminMode}
        onRefreshAll={handleRefreshAll}
        isRefreshing={isRefreshing}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onOpenSettingsModal={() => setIsSettingsModalOpen(true)}
        lastGlobalCheck={lastGlobalCheck}
        firebaseConnected={!!db}
      />

      {/* Bannière de progression pendant le ping */}
      {refreshProgress && (
        <div className="bg-indigo-600/90 text-white text-xs py-1.5 px-4 text-center font-medium flex items-center justify-center gap-2 animate-in fade-in">
          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
          <span>{refreshProgress}</span>
        </div>
      )}

      {/* Contenu Principal */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* 1. Bannière d'état système globale */}
        <GlobalStatusBanner
          services={services}
          lastGlobalCheck={lastGlobalCheck}
        />

        {/* 2. Cartes de Métriques Clés */}
        <MetricCards services={services} />

        {/* 3. Section Liste des Services avec Barre d'outils */}
        <div className="space-y-4">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold tracking-tight text-white">
                  Services & Plateformes Surveillés
                </h2>
                <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  {filteredServices.length}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Statuts en direct, temps de réponse (ms) et taux de disponibilité sur les 30 derniers contrôles
              </p>
            </div>

            {/* Outils de recherche et de filtres */}
            <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
              
              {/* Recherche */}
              <div className="relative flex-1 sm:w-64">
                <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filtrer un service ou une URL..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-900/80 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
                />
              </div>

              {/* Filtres par plateforme */}
              <div className="flex items-center bg-slate-900/80 p-0.5 rounded-xl border border-slate-800">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-2.5 py-1 text-xs font-medium rounded-lg transition ${
                      selectedCategory === cat
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {cat === 'ALL' ? 'Tous' : cat}
                  </button>
                ))}
              </div>

              {/* Bouton d'ajout rapide si admin */}
              {isAdminMode && (
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="p-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition sm:hidden"
                  title="Ajouter"
                >
                  <Plus className="w-4 h-4" />
                </button>
              )}

            </div>
          </div>

          {/* Grille des Cartes de Services */}
          {filteredServices.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {filteredServices.map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  isAdminMode={isAdminMode}
                  onPing={handlePingSingle}
                  onEdit={(s) => setEditingService(s)}
                  onDelete={handleDeleteService}
                />
              ))}
            </div>
          ) : (
            <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-12 text-center">
              <Layers className="w-10 h-10 text-slate-600 mx-auto mb-3" />
              <h3 className="text-sm font-semibold text-white">Aucun service correspondant</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                Aucun service ne correspond à vos filtres actuels. Modifiez votre recherche ou ajoutez un nouveau service.
              </p>
            </div>
          )}

        </div>

        {/* 4. Graphique d'Historique de Latence */}
        <HistoryChart services={services} />

        {/* 5. Journal des Incidents Récent */}
        <IncidentsTimeline services={services} />

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-6 mt-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300">DevStatus</span>
            <span>• Monitoring automatisé des projets d'équipe</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              Stack : React • Node.js • Firestore • GitHub Actions
            </span>
            <a
              href="https://github.com/Flowz5/dev-status"
              target="_blank"
              rel="noreferrer"
              className="text-slate-400 hover:text-white transition flex items-center gap-1"
            >
              <Github className="w-4 h-4" />
              <span>GitHub</span>
            </a>
          </div>
        </div>
      </footer>

      {/* Modales */}
      <AddServiceModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddService={handleAddService}
      />

      <EditServiceModal
        isOpen={!!editingService}
        service={editingService}
        onClose={() => setEditingService(null)}
        onUpdateService={handleUpdateService}
        onDeleteService={handleDeleteService}
      />

      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        firebaseConnected={!!db}
        onResetServices={handleResetServices}
      />

    </div>
  );
}
