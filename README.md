# 🟢 DevStatus — Dashboard de Monitoring de vos Projets d'Équipe

> Une "Status Page" moderne, open-source et en temps réel pour surveiller la disponibilité, la latence et l'état de santé de toutes vos applications et API (Vercel, Firebase, backends, maquettes).

![Uptime](https://img.shields.io/badge/Uptime-99.9%25-10b981?style=for-the-badge&logo=statuspage)
![React](https://img.shields.io/badge/React-18-6366f1?style=for-the-badge&logo=react)
![Tailwind](https://img.shields.io/badge/Tailwind-CSS-38bdf8?style=for-the-badge&logo=tailwindcss)
![Firebase](https://img.shields.io/badge/Firebase-Firestore-f59e0b?style=for-the-badge&logo=firebase)
![GitHub Actions](https://img.shields.io/badge/Cron-GitHub%20Actions-2088ff?style=for-the-badge&logo=githubactions)

---

## 🎯 Le Besoin

Entre les déploiements Vercel, l'hébergement Firebase, les microservices backend et les applications internes, il est crucial d'avoir une tour de contrôle centralisée :
- Savoir instantanément si un service est tombé en panne avant vos utilisateurs.
- Mesurer précisément la latence en millisecondes (ms).
- Fournir une page publique rassurante pour votre équipe et vos clients (*"Tous les services sont opérationnels"*).
- Garder un historique de disponibilité (SLA 99.9%).

---

## 🚀 Projets Préconfigurés dans le Monitoring

| Nom du Service | Plateforme / Catégorie | URL en Ligne | Statut |
| :--- | :--- | :--- | :--- |
| **Dashboard Devs** | Vercel (Frontend) | [dashboard-devs-2d9f.vercel.app](https://dashboard-devs-2d9f.vercel.app/) | 🟢 Opérationnel |
| **Ma Veille Tech** | Firebase (Hosting) | [ma-veille-tech.web.app](https://ma-veille-tech.web.app/) | 🟢 Opérationnel |
| **Tab Prospection** | Vercel (Outil Interne) | [tab-prospection.vercel.app](https://tab-prospection.vercel.app/) | 🟢 Opérationnel |
| **Topaze Notes** | Vercel (Web App) | [topaze-notes.vercel.app](https://topaze-notes.vercel.app/) | 🟢 Opérationnel |

---

## ✨ Fonctionnalités Principales

- 🔍 **Enregistrement et Gestion des URLs** : Ajoutez, modifiez ou supprimez vos projets et APIs avec nom, catégorie (Vercel, Firebase, API Backend), seuil de latence et description.
- ⏱️ **Système de Ping Régulier** :
  - Mesure en direct du code de statut HTTP (200 OK, 3xx, 4xx, 5xx).
  - Temps de réponse exact en millisecondes (`ms`).
  - Détection automatique des ralentissements (seuil dégradé paramétrable).
- 🟢 **Page Publique d'État des Services** :
  - Grande bannière dynamique avec pastilles animées vertes / oranges / rouges.
  - Cartes métriques : Disponibilité globale (99.9%), temps de réponse moyen, compteurs de services en ligne.
  - **Barre d'Uptime Segmentée sur 30 vérifications** avec infobulles interactives (style BetterStack / GitHub Status).
- 📈 **Graphiques d'Historique de Disponibilité & Latence** : Courbes chronologiques de latence pour visualiser la stabilité de chaque application dans le temps.
- 🛡️ **Journal des Incidents** : Historique des coupures et résolutions récentes.
- ⚡ **Double Moteur de Vérification** :
  - **In-App** : Bouton *"Vérifier maintenant"* pour tester instantanément tous les services ou un service individuel sans restriction CORS.
  - **Worker Node.js & GitHub Actions** : Exécution automatisée périodique gratuite (cron toutes les 15 minutes) sans avoir besoin d'un serveur dédié 24/7.
- 🔄 **Architecture Données Hybride** :
  - Support de **Firebase Firestore** en temps réel.
  - Mode local/démo interactif avec persistance `localStorage` immédiate si les clés Firebase ne sont pas encore renseignées.

---

## 🛠️ Stack Technique

- **Frontend** : React 18, Vite, Tailwind CSS, Lucide Icons, Recharts.
- **Monitoring Backend** : Node.js (High-resolution timer via `performance.now()`, Fetch API, timeout controller).
- **Automatisation** : GitHub Actions (`.github/workflows/monitor.yml`).
- **Base de Données** : Firebase Cloud Firestore & LocalStorage fallback.

---

## 💻 Démarrage Rapide

### 1. Installation des dépendances

```bash
git clone https://github.com/Flowz5/dev-status.git
cd dev-status
npm install
```

### 2. Lancer le worker de ping en local

```bash
npm run ping
```

Le script contacte les 4 applications réelles et affiche un rapport coloré détaillé dans votre terminal.

### 3. Lancer l'interface de développement

```bash
npm run dev
```

Ouvrez ensuite [http://localhost:5173](http://localhost:5173) dans votre navigateur.

---

## ⚙️ Configuration Firebase (Optionnel)

Copiez le fichier `.env.example` en `.env` :

```bash
cp .env.example .env
```

Puis renseignez vos identifiants Firebase :

```env
VITE_FIREBASE_API_KEY=votre_cle_api
VITE_FIREBASE_AUTH_DOMAIN=votre_projet.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=votre_project_id
VITE_FIREBASE_STORAGE_BUCKET=votre_projet.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=votre_sender_id
VITE_FIREBASE_APP_ID=votre_app_id
```

> **Astuce** : Vous pouvez également renseigner ces informations directement depuis l'interface web via le bouton **Paramètres ⚙️ > Firebase Firestore**.

---

## 🤖 Surveillance Automatique via GitHub Actions

Le workflow `.github/workflows/monitor.yml` est préconfiguré pour :
1. Se déclencher automatiquement toutes les 15 minutes.
2. Pinger toutes les applications.
3. Archiver le rapport de santé sous forme d'artifact JSON.
4. Être déclenchable manuellement à la demande via le bouton **Run workflow** sur GitHub.

---

## 📦 Déploiement en Production

### Déploiement sur Vercel :
```bash
npm run build
# ou connectez directement le dépôt https://github.com/Flowz5/dev-status sur le dashboard Vercel
```

### Déploiement sur Firebase Hosting :
```bash
npm run build
firebase deploy --only hosting
```

---

## 📄 Licence

Projet sous licence MIT — Réalisé pour le monitoring d'équipe.
