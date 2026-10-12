import React, { useState, useEffect, useCallback } from 'react';
import { VanguardNavbar } from './components/vanguard/VanguardNavbar';
import { VanguardSidebar } from './components/vanguard/VanguardSidebar';
import { VanguardHeaderKpis } from './components/vanguard/VanguardHeaderKpis';
import { VanguardSplineChart } from './components/vanguard/VanguardSplineChart';
import { VanguardTechMixBar } from './components/vanguard/VanguardTechMixBar';
import { VanguardHealthPipeline } from './components/vanguard/VanguardHealthPipeline';
import { VanguardGaugeIndex } from './components/vanguard/VanguardGaugeIndex';
import { VanguardSlaTargets } from './components/vanguard/VanguardSlaTargets';
import { AuthModal } from './components/vanguard/AuthModal';
import { ServiceCard } from './components/ServiceCard';
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
import { subscribeToAuthState, logoutUser, isUserAdmin } from './firebase/auth';
import { db } from './firebase/config';
import { INITIAL_SERVICES } from './data/initialServices';
import { RefreshCw, Plus } from 'lucide-react';

export default function App() {
  const [services, setServices] = useState([]);
  const [selectedServiceId, setSelectedServiceId] = useState(null);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshProgress, setRefreshProgress] = useState(null);
  const [lastGlobalCheck, setLastGlobalCheck] = useState(() => new Date().toISOString());

  // Authentification
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [filterOnlyMine, setFilterOnlyMine] = useState(false);

  // Modales
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);

  // Écoute de l'état d'authentification
  useEffect(() => {
    const unsubAuth = subscribeToAuthState((user) => {
      setCurrentUser(user);
    });
    return () => unsubAuth();
  }, []);

  // Souscription aux services (Firestore ou Local)
  useEffect(() => {
    const unsubscribe = subscribeToServices((data) => {
      setServices(data || []);
    });
    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  // Filtrage : Tous ou Mes Projets
  const displayedServices = filterOnlyMine && currentUser
    ? services.filter(s => s.ownerEmail === currentUser.email || s.userId === currentUser.uid)
    : services;

  // Rafraîchissement global
  const handleRefreshAll = useCallback(async () => {
    if (isRefreshing || displayedServices.length === 0) return;
    setIsRefreshing(true);
    try {
      await pingAllServices(displayedServices, (name, current, total) => {
        setRefreshProgress(`Vérification de ${name} (${current}/${total})...`);
      });
      setLastGlobalCheck(new Date().toISOString());
    } catch (err) {
      console.error("Erreur rafraîchissement global :", err);
    } finally {
      setIsRefreshing(false);
      setRefreshProgress(null);
    }
  }, [isRefreshing, displayedServices]);

  // Ping individuel d'un service
  const handlePingSingle = async (service) => {
    await pingService(service);
    setLastGlobalCheck(new Date().toISOString());
  };

  // Ajout de service (associé au compte utilisateur connecté)
  const handleAddService = async (serviceData) => {
    const enrichedService = {
      ...serviceData,
      ownerEmail: currentUser ? currentUser.email : 'le.dupont.pro@gmail.com',
      userId: currentUser ? currentUser.uid : null
    };
    await addService(enrichedService);
  };

  // Mise à jour de service
  const handleUpdateService = async (id, updates) => {
    await updateService(id, updates);
  };

  // Suppression de service
  const handleDeleteService = async (id) => {
    if (selectedServiceId === id) setSelectedServiceId(null);
    await deleteService(id);
  };

  // Réinitialiser les services aux 4 de départ
  const handleResetServices = () => {
    saveLocalServices(INITIAL_SERVICES);
    setServices(INITIAL_SERVICES);
  };

  const selectedService = displayedServices.find(s => s.id === selectedServiceId) || null;

  return (
    <div className="min-h-screen bg-[#0e0c16] text-[#e6e2f0] flex flex-col font-sans selection:bg-[#f97356] selection:text-white">
      
      {/* 1. Navbar avec Authentification */}
      <VanguardNavbar
        services={displayedServices}
        isRefreshing={isRefreshing}
        onRefreshAll={handleRefreshAll}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onOpenSettingsModal={() => setIsSettingsModalOpen(true)}
        isAdminMode={isAdminMode}
        setIsAdminMode={setIsAdminMode}
        lastGlobalCheck={lastGlobalCheck}
        currentUser={currentUser}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onLogout={logoutUser}
      />

      {/* Bannière de progression pendant le ping */}
      {refreshProgress && (
        <div className="bg-[#f97356] text-white text-xs py-1 px-4 text-center font-mono font-bold flex items-center justify-center gap-2">
          <RefreshCw className="w-3 h-3 animate-spin" />
          <span>{refreshProgress}</span>
        </div>
      )}

      {/* 2. Container Principal : Sidebar Gauche + Dashboard Central */}
      <main className="flex-1 max-w-[1700px] w-full mx-auto p-4 sm:p-6 lg:p-8">
        
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          
          {/* A. Sidebar Gauche : Arborescence des projets & Filtre compte */}
          <VanguardSidebar
            services={displayedServices}
            selectedServiceId={selectedServiceId}
            onSelectService={setSelectedServiceId}
            lastGlobalCheck={lastGlobalCheck}
            currentUser={currentUser}
            filterOnlyMine={filterOnlyMine}
            setFilterOnlyMine={setFilterOnlyMine}
          />

          {/* B. Corps Principal du Dashboard */}
          <div className="flex-1 w-full space-y-6">
            
            {/* Haut : Titre du projet / Hub + 3 Grands Chiffres KPIs */}
            <VanguardHeaderKpis
              selectedService={selectedService}
              services={displayedServices}
              onPingSelected={handlePingSingle}
            />

            {/* Milieu : 2 Grandes Cartes (Courbe de Latence & Répartition Vercel/Firebase) */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <VanguardSplineChart
                services={displayedServices}
                selectedService={selectedService}
              />
              <VanguardTechMixBar
                services={displayedServices}
              />
            </div>

            {/* Bas : 3 Colonnes Claires (État par Catégorie, Jauge de Santé, Objectifs SLA) */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              <VanguardHealthPipeline
                services={displayedServices}
              />
              <VanguardGaugeIndex
                services={displayedServices}
              />
              <VanguardSlaTargets
                services={displayedServices}
              />
            </div>

            {/* Section Détaillée : Les cartes des projets avec les barres de 30 vérifications */}
            <div className="bg-[#161224] border border-[#251f38] rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#251f38]">
                <div>
                  <h3 className="text-sm font-bold font-mono uppercase text-white tracking-wider">
                    {selectedService 
                      ? `DÉTAIL DU SERVICE : ${selectedService.name.toUpperCase()}` 
                      : (filterOnlyMine ? "MES PROJETS SURVEILLÉS (30 DERNIERS CHECKS)" : "HISTORIQUE DÉTAILLÉ DE VOS PROJETS (30 DERNIERS CHECKS)")
                    }
                  </h3>
                  <p className="text-xs text-[#7e7592] font-mono mt-0.5">
                    Pastilles de statut, temps de réponse en millisecondes et date du dernier contrôle
                  </p>
                </div>

                {(isAdminMode || currentUser) && (
                  <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#f97356] hover:bg-[#ff8469] text-white text-xs font-mono font-bold transition shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Nouvelle URL</span>
                  </button>
                )}
              </div>

              {/* Cartes individuelles des projets */}
              <div className="grid grid-cols-1 gap-4">
                {(selectedService ? [selectedService] : displayedServices).map((service) => (
                  <ServiceCard
                    key={service.id}
                    service={service}
                    isAdminMode={isAdminMode || (currentUser && (isUserAdmin(currentUser) || service.ownerEmail === currentUser.email))}
                    onPing={handlePingSingle}
                    onEdit={(s) => setEditingService(s)}
                    onDelete={handleDeleteService}
                  />
                ))}
              </div>
            </div>

          </div>

        </div>

      </main>

      {/* Footer en Français */}
      <footer className="border-t border-[#231d36] bg-[#0c0a13] py-4 text-xs font-mono text-[#6c6382]">
        <div className="max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-[#f97356] font-bold">DEVSTATUS</span>
            <span>• Monitoring de vos Projets d'Équipe</span>
          </div>

          <div className="flex items-center gap-4 text-[#8a7f9e]">
            <span>Connecté à Firebase Firestore</span>
            <span>•</span>
            <a
              href="https://github.com/Flowz5/dev-status"
              target="_blank"
              rel="noreferrer"
              className="text-[#f97356] hover:underline"
            >
              Dépôt GitHub
            </a>
          </div>
        </div>
      </footer>

      {/* Modale d'Authentification */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={(user) => setCurrentUser(user)}
      />

      {/* Modale d'Ajout d'Application */}
      <AddServiceModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddService={handleAddService}
      />

      {/* Modale d'Édition */}
      <EditServiceModal
        isOpen={!!editingService}
        service={editingService}
        onClose={() => setEditingService(null)}
        onUpdateService={handleUpdateService}
        onDeleteService={handleDeleteService}
      />

      {/* Modale des Paramètres */}
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        firebaseConnected={!!db}
        onResetServices={handleResetServices}
      />

    </div>
  );
}
