import React, { useState, useEffect, useCallback } from 'react';
import { VanguardNavbar } from './components/vanguard/VanguardNavbar';
import { VanguardSidebar } from './components/vanguard/VanguardSidebar';
import { VanguardHeaderKpis } from './components/vanguard/VanguardHeaderKpis';
import { VanguardSplineChart } from './components/vanguard/VanguardSplineChart';
import { VanguardTechMixBar } from './components/vanguard/VanguardTechMixBar';
import { VanguardHealthPipeline } from './components/vanguard/VanguardHealthPipeline';
import { VanguardGaugeIndex } from './components/vanguard/VanguardGaugeIndex';
import { VanguardSlaTargets } from './components/vanguard/VanguardSlaTargets';
import { LoginPage } from './components/vanguard/LoginPage';
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
import { RefreshCw, Plus, ShieldCheck } from 'lucide-react';

export default function App() {
  const [services, setServices] = useState([]);
  const [selectedServiceId, setSelectedServiceId] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshProgress, setRefreshProgress] = useState(null);
  const [lastGlobalCheck, setLastGlobalCheck] = useState(() => new Date().toISOString());

  // Authentification & Auth Wall
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthChecking, setIsAuthChecking] = useState(true);

  // Modales
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);

  // Écoute de l'état d'authentification
  useEffect(() => {
    const unsubAuth = subscribeToAuthState((user) => {
      setCurrentUser(user);
      setIsAuthChecking(false);
    });
    return () => unsubAuth();
  }, []);

  // Souscription aux services strictement cloisonnés au compte connecté
  useEffect(() => {
    if (!currentUser) {
      setServices([]);
      return;
    }
    const unsubscribe = subscribeToServices(currentUser.email, (data) => {
      setServices(data || []);
    });
    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, [currentUser]);

  const displayedServices = services;

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
    if (!currentUser) return;
    const enrichedService = {
      ...serviceData,
      ownerEmail: currentUser.email,
      userId: currentUser.uid
    };
    await addService(enrichedService, currentUser.email);
  };

  // Mise à jour de service
  const handleUpdateService = async (id, updates) => {
    if (!currentUser) return;
    await updateService(id, updates, currentUser.email);
  };

  // Suppression de service
  const handleDeleteService = async (id) => {
    if (!currentUser) return;
    if (selectedServiceId === id) setSelectedServiceId(null);
    await deleteService(id, currentUser.email);
  };

  // Réinitialiser les services
  const handleResetServices = () => {
    if (!currentUser) return;
    if (isUserAdmin(currentUser)) {
      saveLocalServices(INITIAL_SERVICES, currentUser.email);
      setServices(INITIAL_SERVICES);
    } else {
      saveLocalServices([], currentUser.email);
      setServices([]);
    }
  };

  const selectedService = displayedServices.find(s => s.id === selectedServiceId) || null;

  // 1. Écran de chargement initial (évite tout flash)
  if (isAuthChecking) {
    return (
      <div className="min-h-screen bg-[#0e0c16] flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#f97356] to-[#d94f32] p-2 flex items-center justify-center animate-pulse shadow-lg shadow-[#f97356]/20">
            <RefreshCw className="w-5 h-5 text-white animate-spin" />
          </div>
          <span className="font-mono text-xs text-[#8a7f9e]">Chargement de votre espace sécurisé...</span>
        </div>
      </div>
    );
  }

  // 2. Barrière d'authentification : si non connecté, afficher exclusivement la page de connexion
  if (!currentUser) {
    return <LoginPage onAuthSuccess={(user) => setCurrentUser(user)} />;
  }

  // 3. Tableau de bord après authentification
  return (
    <div className="min-h-screen bg-[#0e0c16] text-[#e6e2f0] flex flex-col font-sans selection:bg-[#f97356] selection:text-white">
      
      {/* Navbar avec statut utilisateur et actions */}
      <VanguardNavbar
        services={displayedServices}
        isRefreshing={isRefreshing}
        onRefreshAll={handleRefreshAll}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onOpenSettingsModal={() => setIsSettingsModalOpen(true)}
        currentUser={currentUser}
        onLogout={async () => {
          await logoutUser();
          setCurrentUser(null);
          setServices([]);
        }}
      />

      {/* Bannière de progression pendant le ping */}
      {refreshProgress && (
        <div className="bg-[#f97356] text-white text-xs py-1 px-4 text-center font-mono font-bold flex items-center justify-center gap-2">
          <RefreshCw className="w-3 h-3 animate-spin" />
          <span>{refreshProgress}</span>
        </div>
      )}

      {/* Container Principal : Sidebar Gauche + Dashboard Central */}
      <main className="flex-1 max-w-[1700px] w-full mx-auto p-4 sm:p-6 lg:p-8">
        
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          
          {/* A. Sidebar Gauche : Arborescence des projets */}
          <VanguardSidebar
            services={displayedServices}
            selectedServiceId={selectedServiceId}
            onSelectService={setSelectedServiceId}
            lastGlobalCheck={lastGlobalCheck}
            currentUser={currentUser}
          />

          {/* B. Corps Principal du Dashboard */}
          <div className="flex-1 w-full space-y-6">
            
            {displayedServices.length === 0 ? (
              /* État Vierge pour tout nouvel utilisateur */
              <div className="bg-[#161224] border border-[#251f38] rounded-3xl p-8 sm:p-14 text-center shadow-2xl space-y-6">
                <div className="w-16 h-16 rounded-2xl bg-[#231b38] border border-[#372b54] p-3 mx-auto flex items-center justify-center text-[#f97356] shadow-lg shadow-[#f97356]/10">
                  <Plus className="w-8 h-8" />
                </div>
                <div className="max-w-md mx-auto">
                  <h3 className="text-xl font-bold text-white font-sans">
                    Votre tableau de bord est vierge
                  </h3>
                  <p className="text-xs font-mono text-[#8a7f9e] mt-2.5 leading-relaxed">
                    Bienvenue <span className="text-[#fde68a]">{currentUser.email}</span> ! Vous n'avez encore aucun projet sous surveillance. Enregistrez votre première URL d'application ou d'API pour lancer le monitoring.
                  </p>
                </div>
                <div>
                  <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#f97356] hover:bg-[#ff8469] text-white text-xs font-mono font-bold transition shadow-lg shadow-[#f97356]/20 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Ajouter mon premier projet</span>
                  </button>
                </div>
              </div>
            ) : (
              <>
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

                {/* Bas : 3 Colonnes (État par Catégorie, Jauge de Santé, Objectifs SLA) */}
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
                          : "HISTORIQUE DÉTAILLÉ DE VOS PROJETS (30 DERNIERS CHECKS)"
                        }
                      </h3>
                      <p className="text-xs text-[#7e7592] font-mono mt-0.5">
                        Pastilles de statut, temps de réponse en millisecondes et date du dernier contrôle
                      </p>
                    </div>

                    <button
                      onClick={() => setIsAddModalOpen(true)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#f97356] hover:bg-[#ff8469] text-white text-xs font-mono font-bold transition shadow-sm cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Nouvelle URL</span>
                    </button>
                  </div>

                  {/* Cartes individuelles des projets */}
                  <div className="grid grid-cols-1 gap-4">
                    {(selectedService ? [selectedService] : displayedServices).map((service) => (
                      <ServiceCard
                        key={service.id}
                        service={service}
                        isAdminMode={true}
                        onPing={handlePingSingle}
                        onEdit={(s) => setEditingService(s)}
                        onDelete={handleDeleteService}
                      />
                    ))}
                  </div>
                </div>
              </>
            )}

          </div>

        </div>

      </main>

      {/* Footer en Français */}
      <footer className="border-t border-[#231d36] bg-[#0c0a13] py-4 text-xs font-mono text-[#6c6382]">
        <div className="max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-[#f97356] font-bold">DEVSTATUS</span>
            <span>• Espace Privé de Monitoring</span>
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
