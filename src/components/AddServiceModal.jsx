import React, { useState } from 'react';
import { X, PlusCircle, Globe, Tag, Clock, CheckCircle2, AlertTriangle, RefreshCw } from 'lucide-react';

export function AddServiceModal({ isOpen, onClose, onAddService }) {
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    category: 'Vercel',
    description: '',
    degradedThresholdMs: 800
  });

  const [testResult, setTestResult] = useState(null);
  const [isTesting, setIsTesting] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleTestUrl = async () => {
    if (!formData.url) {
      setError("Veuillez saisir une URL à tester");
      return;
    }

    let urlToTest = formData.url.trim();
    if (!urlToTest.startsWith('http://') && !urlToTest.startsWith('https://')) {
      urlToTest = 'https://' + urlToTest;
      setFormData(prev => ({ ...prev, url: urlToTest }));
    }

    setIsTesting(true);
    setError(null);
    setTestResult(null);

    const start = performance.now();
    try {
      const res = await fetch(`/api/ping?url=${encodeURIComponent(urlToTest)}`);
      const data = await res.json();
      setTestResult({
        statusCode: data.statusCode,
        responseTime: data.responseTime,
        operational: data.statusCode >= 200 && data.statusCode < 400
      });
    } catch (err) {
      const duration = Math.round(performance.now() - start);
      setTestResult({
        statusCode: 0,
        responseTime: duration,
        operational: false,
        error: err.message
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.url.trim()) {
      setError("Le nom et l'URL sont obligatoires");
      return;
    }

    let formattedUrl = formData.url.trim();
    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = 'https://' + formattedUrl;
    }

    onAddService({
      ...formData,
      url: formattedUrl,
      id: 'srv-' + Date.now(),
      statusCode: testResult ? testResult.statusCode : 200,
      responseTime: testResult ? testResult.responseTime : 0,
      status: testResult ? (testResult.operational ? 'operational' : 'down') : 'operational'
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Enregistrer une Nouvelle URL</h3>
              <p className="text-xs text-slate-400">Ajouter une application ou une API à la surveillance temps réel</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          
          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Nom du projet / de l'API *
            </label>
            <input
              type="text"
              required
              placeholder="ex: API Authentification, Frontend Vercel..."
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              URL à surveiller *
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  required
                  placeholder="https://mon-app.vercel.app/"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-3.5 pr-10 py-2.5 text-sm text-white font-mono placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                />
              </div>
              <button
                type="button"
                onClick={handleTestUrl}
                disabled={isTesting || !formData.url}
                className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 border border-slate-700 transition flex items-center gap-1.5 disabled:opacity-50"
                title="Tester immédiatement l'URL"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-emerald-400 ${isTesting ? 'animate-spin' : ''}`} />
                <span>Tester</span>
              </button>
            </div>

            {/* Résultat du test d'URL */}
            {testResult && (
              <div className={`mt-2 p-2.5 rounded-xl border text-xs flex items-center justify-between ${
                testResult.operational 
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' 
                  : 'bg-red-500/10 border-red-500/30 text-red-300'
              }`}>
                <div className="flex items-center gap-2">
                  {testResult.operational ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                  <span>{testResult.operational ? 'URL accessible avec succès' : 'Échec de connexion à l\'URL'}</span>
                </div>
                <div className="font-mono flex items-center gap-2">
                  <span>HTTP {testResult.statusCode}</span>
                  <span>•</span>
                  <span>{testResult.responseTime} ms</span>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Plateforme / Catégorie
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition"
              >
                <option value="Vercel">Vercel</option>
                <option value="Firebase">Firebase</option>
                <option value="API Backend">API Backend</option>
                <option value="Autre">Autre</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Seuil Dégradation (ms)
              </label>
              <input
                type="number"
                min="100"
                step="50"
                value={formData.degradedThresholdMs}
                onChange={(e) => setFormData({ ...formData, degradedThresholdMs: Number(e.target.value) })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-indigo-500 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Description (optionnel)
            </label>
            <textarea
              rows="2"
              placeholder="Rôle du service, dépendances ou équipe responsable..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
            />
          </div>

          {/* Boutons d'action */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-sm font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20 transition flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Ajouter au monitoring</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
