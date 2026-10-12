import React, { useState } from 'react';
import { X, Settings, Database, Save, RotateCcw, Download, Upload, CheckCircle2, AlertCircle } from 'lucide-react';
import { INITIAL_SERVICES } from '../data/initialServices';
import { saveLocalServices } from '../firebase/services';

export function SettingsModal({ isOpen, onClose, firebaseConnected, onResetServices }) {
  const [activeTab, setActiveTab] = useState('firebase');
  const [configValues, setConfigValues] = useState(() => {
    try {
      const saved = localStorage.getItem('devstatus_firebase_config');
      return saved ? JSON.parse(saved) : {
        apiKey: '',
        authDomain: '',
        projectId: '',
        storageBucket: '',
        messagingSenderId: '',
        appId: ''
      };
    } catch {
      return { apiKey: '', authDomain: '', projectId: '', storageBucket: '', messagingSenderId: '', appId: '' };
    }
  });

  const [message, setMessage] = useState(null);

  if (!isOpen) return null;

  const handleSaveFirebase = (e) => {
    e.preventDefault();
    try {
      localStorage.setItem('devstatus_firebase_config', JSON.stringify(configValues));
      setMessage({ type: 'success', text: 'Configuration Firebase enregistrée ! Rechargez la page pour appliquer.' });
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    }
  };

  const handleExportData = () => {
    const data = localStorage.getItem('devstatus_services_data');
    const blob = new Blob([data || JSON.stringify(INITIAL_SERVICES, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `devstatus-export-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
  };

  const handleImportData = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (Array.isArray(parsed)) {
          saveLocalServices(parsed);
          setMessage({ type: 'success', text: `${parsed.length} services importés avec succès !` });
          setTimeout(() => window.location.reload(), 1000);
        } else {
          setMessage({ type: 'error', text: 'Format de fichier JSON invalide.' });
        }
      } catch (err) {
        setMessage({ type: 'error', text: 'Erreur lors de la lecture du fichier : ' + err.message });
      }
    };
    reader.readAsText(file);
  };

  const handleResetToDefaults = () => {
    if (window.confirm("Voulez-vous réinitialiser tous les services avec les 4 projets par défaut ?")) {
      onResetServices();
      setMessage({ type: 'success', text: 'Services réinitialisés aux 4 projets originaux.' });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl p-6 shadow-2xl relative">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Paramètres & Synchronisation</h3>
              <p className="text-xs text-slate-400">Configuration Firestore et gestion des données</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Feedback message */}
        {message && (
          <div className={`mt-4 p-3 rounded-xl border text-xs flex items-center gap-2 ${
            message.type === 'success' 
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' 
              : 'bg-red-500/10 border-red-500/30 text-red-300'
          }`}>
            {message.type === 'success' ? <CheckCircle2 className="w-4 h-4 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 flex-shrink-0" />}
            <span>{message.text}</span>
          </div>
        )}

        {/* Tabs */}
        <div className="flex items-center gap-2 mt-4 border-b border-slate-800 pb-2">
          <button
            onClick={() => setActiveTab('firebase')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              activeTab === 'firebase'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Firebase Firestore
          </button>
          <button
            onClick={() => setActiveTab('data')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              activeTab === 'data'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Sauvegarde & Données
          </button>
        </div>

        {/* Tab 1: Firebase Firestore */}
        {activeTab === 'firebase' && (
          <form onSubmit={handleSaveFirebase} className="mt-4 space-y-3">
            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-300 flex items-start gap-2.5">
              <Database className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-white">Statut actuel : </strong>
                {firebaseConnected ? (
                  <span className="text-emerald-400 font-medium">Connecté à Cloud Firestore</span>
                ) : (
                  <span className="text-amber-400 font-medium">Mode Local / Démo interactif</span>
                )}
                <p className="text-slate-400 mt-1">
                  Vous pouvez entrer vos clés Firebase ici ou dans un fichier <code className="text-indigo-400">.env</code>.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  API Key
                </label>
                <input
                  type="text"
                  placeholder="AIzaSy..."
                  value={configValues.apiKey}
                  onChange={(e) => setConfigValues({ ...configValues, apiKey: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Project ID
                </label>
                <input
                  type="text"
                  placeholder="mon-projet-firebase"
                  value={configValues.projectId}
                  onChange={(e) => setConfigValues({ ...configValues, projectId: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Auth Domain
                </label>
                <input
                  type="text"
                  placeholder="mon-projet.firebaseapp.com"
                  value={configValues.authDomain}
                  onChange={(e) => setConfigValues({ ...configValues, authDomain: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  App ID
                </label>
                <input
                  type="text"
                  placeholder="1:123456789:web:abcdef"
                  value={configValues.appId}
                  onChange={(e) => setConfigValues({ ...configValues, appId: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                type="submit"
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Enregistrer & Appliquer</span>
              </button>
            </div>
          </form>
        )}

        {/* Tab 2: Gestion des données */}
        {activeTab === 'data' && (
          <div className="mt-4 space-y-4">
            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
              <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-1">
                Sauvegarde & Restauration
              </h4>
              <p className="text-xs text-slate-400 mb-3">
                Exportez ou restaurez l'intégralité de la configuration de vos services sous forme de fichier JSON.
              </p>
              
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleExportData}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 border border-slate-700 transition flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Exporter (JSON)</span>
                </button>

                <label className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 border border-slate-700 transition flex items-center gap-1.5 cursor-pointer">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Importer un fichier JSON</span>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportData}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-semibold text-white">Réinitialiser les services</h4>
                <p className="text-xs text-slate-400">Recharger les 4 projets d'origine de l'équipe</p>
              </div>
              <button
                type="button"
                onClick={handleResetToDefaults}
                className="px-3 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/30 text-xs font-medium transition flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Réinitialiser</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
