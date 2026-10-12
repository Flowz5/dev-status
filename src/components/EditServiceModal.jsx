import React, { useState, useEffect } from 'react';
import { X, Save, Edit3, Trash2 } from 'lucide-react';

export function EditServiceModal({ isOpen, onClose, service, onUpdateService, onDeleteService }) {
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    category: 'Vercel',
    description: '',
    degradedThresholdMs: 800,
    active: true
  });

  useEffect(() => {
    if (service) {
      setFormData({
        name: service.name || '',
        url: service.url || '',
        category: service.category || 'Vercel',
        description: service.description || '',
        degradedThresholdMs: service.degradedThresholdMs || 800,
        active: service.active !== false
      });
    }
  }, [service]);

  if (!isOpen || !service) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdateService(service.id, formData);
    onClose();
  };

  const handleDelete = () => {
    if (window.confirm(`Confirmez-vous la suppression de ${service.name} du monitoring ?`)) {
      onDeleteService(service.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#161224] border border-[#251f38] rounded-2xl w-full max-w-lg p-6 shadow-2xl relative font-sans text-[#e6e2f0]">
        
        {/* Header Vanguard */}
        <div className="flex items-center justify-between pb-4 border-b border-[#251f38]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#2b1b22] text-[#f97356] border border-[#522931]">
              <Edit3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-sans">Modifier le Projet</h3>
              <p className="text-xs text-[#8f85a8] font-mono">{service.name}</p>
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
          
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8f85a8] mb-1.5 font-mono">
              Nom du projet *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-[#100d1c] border border-[#251f38] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#f97356] transition"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8f85a8] mb-1.5 font-mono">
              URL *
            </label>
            <input
              type="text"
              required
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              className="w-full bg-[#100d1c] border border-[#251f38] rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-[#f97356] transition"
            />
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
              Description
            </label>
            <textarea
              rows="2"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-[#100d1c] border border-[#251f38] rounded-xl px-3.5 py-2 text-xs text-white placeholder-[#5b5270] focus:outline-none focus:border-[#f97356] transition"
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <input
              type="checkbox"
              id="activeCheckbox"
              checked={formData.active}
              onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
              className="w-4 h-4 rounded text-[#f97356] focus:ring-[#f97356] bg-[#100d1c] border-[#251f38]"
            />
            <label htmlFor="activeCheckbox" className="text-xs font-mono text-[#b0a5c7]">
              Actif dans la surveillance périodique
            </label>
          </div>

          {/* Boutons d'action */}
          <div className="flex items-center justify-between pt-4 border-t border-[#251f38]">
            <button
              type="button"
              onClick={handleDelete}
              className="px-3.5 py-2 rounded-xl text-xs font-mono font-bold text-[#ef4444] hover:bg-[#381a1f] border border-[#59222c] transition flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Supprimer</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-mono text-[#8f85a8] hover:text-white hover:bg-[#1f1a30] transition"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl text-xs font-mono font-bold bg-[#f97356] hover:bg-[#ff8469] text-white shadow-md shadow-[#f97356]/20 transition flex items-center gap-2"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Enregistrer</span>
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
}
