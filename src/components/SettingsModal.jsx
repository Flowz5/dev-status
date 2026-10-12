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
      setMessage({ type: 'success', text: 'Configuration enregistrée ! Rechargez la page pour appliquer.' });
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
    if (window.confirm("Voulez-vous réinitialiser tous les services avec les 4 projets d'origine ?")) {
      onResetServices();
      setMessage({ type: 'success', text: 'Services réinitialisés aux 4 projets originaux.' });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#161224] border border-[#251f38] rounded-2xl w-full max-w-xl p-5 sm:p-6 shadow-2xl relative font-sans text-[#e6e2f0] max-h-[90vh] overflow-y-auto">
        
        {/* Header dans le thème Vanguard */}
        <div className="flex items-center justify-between pb-4 border-b border-[#251f38]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#2b1b22] text-[#f97356] border border-[#522931]">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-sans">Paramètres & Synchronisation</h3>
              <p className="text-xs text-[#8f85a8] font-mono">Connexion Cloud Firestore & Sauvegardes</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#8f85a8] hover:text-white hover:bg-[#1f1a30] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message d'état */}
        {message && (
          <div className={`mt-4 p-3 rounded-xl border text-xs font-mono flex items-center gap-2 ${
            message.type === 'success' 
              ? 'bg-[#132d20] border-[#1d4c36] text-[#34d399]' 
              : 'bg-[#381a1f] border-[#59222c] text-[#ef4444]'
          }`}>
            {message.type === 'success' ? <CheckCircle2 className="w-4 h-4 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 flex-shrink-0" />}
            <span>{message.text}</span>
          </div>
        )}

        {/* Onglets style Vanguard */}
        <div className="flex items-center gap-2 mt-4 border-b border-[#251f38] pb-2 font-mono text-xs">
          <button
            onClick={() => setActiveTab('firebase')}
            className={`px-3 py-1.5 rounded-lg font-bold transition ${
              activeTab === 'firebase'
                ? 'bg-[#f97356] text-white shadow-sm'
                : 'text-[#8f85a8] hover:text-white'
            }`}
          >
            Firebase Firestore
          </button>
          <button
            onClick={() => setActiveTab('data')}
            className={`px-3 py-1.5 rounded-lg font-bold transition ${
              activeTab === 'data'
                ? 'bg-[#f97356] text-white shadow-sm'
                : 'text-[#8f85a8] hover:text-white'
            }`}
          >
            Sauvegarde & Données
          </button>
        </div>

        {/* Onglet 1 : Firebase */}
        {activeTab === 'firebase' && (
          <form onSubmit={handleSaveFirebase} className="mt-4 space-y-3 font-mono text-xs">
            <div className="p-3 rounded-xl bg-[#100d1c] border border-[#251f38] text-xs text-[#b0a5c7] flex items-start gap-2.5">
              <Database className="w-4 h-4 text-[#fde68a] flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-white font-sans">Statut actuel : </strong>
                {firebaseConnected ? (
                  <span className="text-[#34d399] font-bold">Connecté à Cloud Firestore</span>
                ) : (
                  <span className="text-[#fde68a] font-bold">Mode Local / Démo interactif</span>
                )}
                <p className="text-[#7e7494] mt-1 font-sans text-[11px]">
                  Vos clés sont synchronisées via le fichier <code className="text-[#f97356]">.env</code> ou via ce formulaire.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8f85a8] mb-1">
                  API Key
                </label>
                <input
                  type="text"
                  placeholder="AIzaSy..."
                  value={configValues.apiKey}
                  onChange={(e) => setConfigValues({ ...configValues, apiKey: e.target.value })}
                  className="w-full bg-[#100d1c] border border-[#251f38] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#f97356]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8f85a8] mb-1">
                  Project ID
                </label>
                <input
                  type="text"
                  placeholder="dev-status-23bde"
                  value={configValues.projectId}
                  onChange={(e) => setConfigValues({ ...configValues, projectId: e.target.value })}
                  className="w-full bg-[#100d1c] border border-[#251f38] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#f97356]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8f85a8] mb-1">
                  Auth Domain
                </label>
                <input
                  type="text"
                  placeholder="dev-status-23bde.firebaseapp.com"
                  value={configValues.authDomain}
                  onChange={(e) => setConfigValues({ ...configValues, authDomain: e.target.value })}
                  className="w-full bg-[#100d1c] border border-[#251f38] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#f97356]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8f85a8] mb-1">
                  App ID
                </label>
                <input
                  type="text"
                  placeholder="1:174259713194:web:d3969a..."
                  value={configValues.appId}
                  onChange={(e) => setConfigValues({ ...configValues, appId: e.target.value })}
                  className="w-full bg-[#100d1c] border border-[#251f38] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#f97356]"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#251f38]">
              <button
                type="submit"
                className="px-4 py-2 rounded-xl text-xs font-bold font-mono bg-[#f97356] hover:bg-[#ff8469] text-white transition flex items-center gap-1.5 shadow-md shadow-[#f97356]/20"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Enregistrer & Appliquer</span>
              </button>
            </div>
          </form>
        )}

        {/* Onglet 2 : Données */}
        {activeTab === 'data' && (
          <div className="mt-4 space-y-4 font-mono text-xs">
            <div className="p-3 rounded-xl bg-[#100d1c] border border-[#251f38]">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-1 font-sans">
                Export & Import JSON
              </h4>
              <p className="text-xs text-[#8f85a8] mb-3 font-sans">
                Téléchargez la liste de vos projets configurés ou restaurez-la d'un simple clic.
              </p>
              
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleExportData}
                  className="px-3 py-2 rounded-xl bg-[#1b162b] hover:bg-[#251f38] text-xs font-medium text-white border border-[#251f38] transition flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5 text-[#f97356]" />
                  <span>Exporter (JSON)</span>
                </button>

                <label className="px-3 py-2 rounded-xl bg-[#1b162b] hover:bg-[#251f38] text-xs font-medium text-white border border-[#251f38] transition flex items-center gap-1.5 cursor-pointer">
                  <Upload className="w-3.5 h-3.5 text-[#34d399]" />
                  <span>Importer (JSON)</span>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportData}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#100d1c] border border-[#251f38] flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-white font-sans">Réinitialiser les 4 projets</h4>
                <p className="text-xs text-[#8f85a8] font-sans">Recharger la liste d'origine de l'équipe</p>
              </div>
              <button
                type="button"
                onClick={handleResetToDefaults}
                className="px-3 py-2 rounded-xl bg-[#381a1f] hover:bg-[#482027] text-[#ef4444] border border-[#59222c] text-xs font-bold transition flex items-center gap-1.5"
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
