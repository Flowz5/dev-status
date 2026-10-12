import React, { useState } from 'react';
import { X, PlusCircle, Globe, CheckCircle2, AlertTriangle, RefreshCw } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#161224] border border-[#251f38] rounded-2xl w-full max-w-lg p-6 shadow-2xl relative font-sans text-[#e6e2f0]">
        
        {/* Header Vanguard */}
        <div className="flex items-center justify-between pb-4 border-b border-[#251f38]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#2b1b22] text-[#f97356] border border-[#522931]">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-sans">Ajouter une Nouvelle Application</h3>
              <p className="text-xs text-[#8f85a8] font-mono">Enregistrer une URL à surveiller en temps réel</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#8f85a8] hover:text-white hover:bg-[#1f1a30] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          
          {error && (
            <div className="p-3 rounded-xl bg-[#381a1f] border border-[#59222c] text-[#ef4444] text-xs font-mono flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8f85a8] mb-1.5 font-mono">
              Nom du projet / de l'application *
            </label>
            <input
              type="text"
              required
              placeholder="ex: Mon Dashboard, API Backend..."
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-[#100d1c] border border-[#251f38] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-[#5b5270] focus:outline-none focus:border-[#f97356] transition"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8f85a8] mb-1.5 font-mono">
              URL à surveiller *
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  required
                  placeholder="https://mon-application.vercel.app/"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  className="w-full bg-[#100d1c] border border-[#251f38] rounded-xl px-3.5 py-2.5 text-xs text-white font-mono placeholder-[#5b5270] focus:outline-none focus:border-[#f97356] transition"
                />
              </div>
              <button
                type="button"
                onClick={handleTestUrl}
                disabled={isTesting || !formData.url}
                className="px-3.5 py-2.5 rounded-xl bg-[#1b162b] hover:bg-[#251f38] text-xs font-bold font-mono text-[#f97356] border border-[#251f38] transition flex items-center gap-1.5 disabled:opacity-50"
                title="Tester immédiatement l'URL"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
                <span>Tester</span>
              </button>
            </div>

            {/* Résultat du test d'URL */}
            {testResult && (
              <div className={`mt-2 p-2.5 rounded-xl border text-xs font-mono flex items-center justify-between ${
                testResult.operational 
                  ? 'bg-[#132d20] border-[#1d4c36] text-[#34d399]' 
                  : 'bg-[#381a1f] border-[#59222c] text-[#ef4444]'
              }`}>
                <div className="flex items-center gap-2">
                  {testResult.operational ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                  <span>{testResult.operational ? 'URL joignable avec succès' : 'Échec de connexion à l\'URL'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>HTTP {testResult.statusCode}</span>
                  <span>•</span>
                  <span>{testResult.responseTime} ms</span>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8f85a8] mb-1.5 font-mono">
                Plateforme / Environnement
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-[#100d1c] border border-[#251f38] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#f97356] font-mono transition"
              >
                <option value="Vercel">Vercel</option>
                <option value="Firebase">Firebase</option>
                <option value="API Backend">API Backend</option>
                <option value="Autre">Autre</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8f85a8] mb-1.5 font-mono">
                Seuil d'alerte (ms)
              </label>
              <input
                type="number"
                min="100"
                step="50"
                value={formData.degradedThresholdMs}
                onChange={(e) => setFormData({ ...formData, degradedThresholdMs: Number(e.target.value) })}
                className="w-full bg-[#100d1c] border border-[#251f38] rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-[#f97356] transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8f85a8] mb-1.5 font-mono">
              Description (optionnel)
            </label>
            <textarea
              rows="2"
              placeholder="Rôle de l'application..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-[#100d1c] border border-[#251f38] rounded-xl px-3.5 py-2 text-xs text-white placeholder-[#5b5270] focus:outline-none focus:border-[#f97356] transition"
            />
          </div>

          {/* Boutons d'action */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#251f38]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-mono font-medium text-[#8f85a8] hover:text-white hover:bg-[#1f1a30] transition"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-mono font-bold bg-[#f97356] hover:bg-[#ff8469] text-white shadow-md shadow-[#f97356]/20 transition flex items-center gap-2"
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
